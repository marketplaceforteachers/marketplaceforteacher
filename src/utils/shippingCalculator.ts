import { Product, PackageMeasurements, CalculatedShippingRate, ShippingMethodType } from '../types';

// Approximate centroid coordinates for common US zip prefix ranges / metro areas
const ZIP_COORDINATES: Record<string, { lat: number; lng: number; city: string; state: string }> = {
  // Oklahoma / Central
  '73159': { lat: 35.378, lng: -97.558, city: 'Oklahoma City', state: 'OK' },
  '73013': { lat: 35.637, lng: -97.439, city: 'Edmond', state: 'OK' },
  '73069': { lat: 35.222, lng: -97.439, city: 'Norman', state: 'OK' },
  '74103': { lat: 36.154, lng: -95.992, city: 'Tulsa', state: 'OK' },
  // Texas
  '75201': { lat: 32.787, lng: -96.797, city: 'Dallas', state: 'TX' },
  '77002': { lat: 29.756, lng: -95.367, city: 'Houston', state: 'TX' },
  '78701': { lat: 30.267, lng: -97.743, city: 'Austin', state: 'TX' },
  '78205': { lat: 29.424, lng: -98.493, city: 'San Antonio', state: 'TX' },
  // Midwest
  '60601': { lat: 41.884, lng: -87.627, city: 'Chicago', state: 'IL' },
  '63101': { lat: 38.627, lng: -90.199, city: 'St. Louis', state: 'MO' },
  '46204': { lat: 39.768, lng: -86.158, city: 'Indianapolis', state: 'IN' },
  '48226': { lat: 42.331, lng: -83.045, city: 'Detroit', state: 'MI' },
  '55401': { lat: 44.977, lng: -93.265, city: 'Minneapolis', state: 'MN' },
  // Northeast
  '10001': { lat: 40.750, lng: -73.996, city: 'New York', state: 'NY' },
  '02108': { lat: 42.358, lng: -71.063, city: 'Boston', state: 'MA' },
  '19102': { lat: 39.952, lng: -75.163, city: 'Philadelphia', state: 'PA' },
  '20001': { lat: 38.910, lng: -77.016, city: 'Washington', state: 'DC' },
  // Southeast
  '30303': { lat: 33.753, lng: -84.385, city: 'Atlanta', state: 'GA' },
  '33101': { lat: 25.774, lng: -80.193, city: 'Miami', state: 'FL' },
  '37201': { lat: 36.162, lng: -86.781, city: 'Nashville', state: 'TN' },
  '28202': { lat: 35.227, lng: -80.843, city: 'Charlotte', state: 'NC' },
  // West / Mountain / Pacific
  '90001': { lat: 33.973, lng: -118.248, city: 'Los Angeles', state: 'CA' },
  '94102': { lat: 37.774, lng: -122.419, city: 'San Francisco', state: 'CA' },
  '98101': { lat: 47.606, lng: -122.332, city: 'Seattle', state: 'WA' },
  '80202': { lat: 39.754, lng: -104.996, city: 'Denver', state: 'CO' },
  '85001': { lat: 33.448, lng: -112.074, city: 'Phoenix', state: 'AZ' },
  '97201': { lat: 45.515, lng: -122.678, city: 'Portland', state: 'OR' },
};

// Fallback approximate coordinates by first digit of 5-digit US ZIP
const ZIP_FIRST_DIGIT_MAP: Record<string, { lat: number; lng: number }> = {
  '0': { lat: 42.0, lng: -71.5 }, // New England
  '1': { lat: 41.0, lng: -74.0 }, // NY / PA
  '2': { lat: 37.5, lng: -78.0 }, // Mid-Atlantic / NC / VA
  '3': { lat: 32.5, lng: -84.0 }, // Southeast / FL / GA
  '4': { lat: 39.5, lng: -84.0 }, // OH / IN / KY / MI
  '5': { lat: 44.0, lng: -93.0 }, // Upper Midwest / MN / WI
  '6': { lat: 39.0, lng: -90.0 }, // IL / MO / KS / NE
  '7': { lat: 34.0, lng: -97.0 }, // OK / TX / AR / LA
  '8': { lat: 38.0, lng: -106.0 }, // Mountain / CO / AZ / NM / UT
  '9': { lat: 36.0, lng: -119.0 }, // West Coast / CA / WA / OR
};

/**
 * Calculates Great-Circle Distance between two coordinates in miles (Haversine formula)
 */
export function calculateDistanceInMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3958.8; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Resolves approximate coordinates for any 5-digit US ZIP code
 */
export function getCoordinatesForZip(zip: string): { lat: number; lng: number } {
  const cleaned = (zip || '').trim().slice(0, 5);
  if (ZIP_COORDINATES[cleaned]) {
    return { lat: ZIP_COORDINATES[cleaned].lat, lng: ZIP_COORDINATES[cleaned].lng };
  }
  const firstChar = cleaned.charAt(0);
  if (ZIP_FIRST_DIGIT_MAP[firstChar]) {
    return ZIP_FIRST_DIGIT_MAP[firstChar];
  }
  // Default to Oklahoma City geographic center
  return { lat: 35.378, lng: -97.558 };
}

/**
 * Determines USPS/Carrier Postal Zone (1 to 8) from distance in miles
 */
export function getPostalZone(distanceMiles: number): number {
  if (distanceMiles <= 150) return 2;
  if (distanceMiles <= 300) return 3;
  if (distanceMiles <= 600) return 4;
  if (distanceMiles <= 1000) return 5;
  if (distanceMiles <= 1400) return 6;
  if (distanceMiles <= 1800) return 7;
  return 8;
}

/**
 * Calculates billable shipping weight combining actual weight & dimensional weight
 * Domestic carrier standard: (L x W x H) / 139
 */
export function calculateBillableWeight(measurements?: PackageMeasurements): {
  actualLbs: number;
  dimLbs: number;
  billableLbs: number;
} {
  const weightLbs = measurements?.weightLbs || 1;
  const weightOz = measurements?.weightOz || 0;
  const actualLbs = Math.max(0.1, weightLbs + weightOz / 16);

  const l = measurements?.lengthInches || 10;
  const w = measurements?.widthInches || 8;
  const h = measurements?.heightInches || 4;

  const dimLbs = (l * w * h) / 139;
  // Billable weight is the greater of actual weight or dim weight (with a 0.25 lb min floor)
  const billableLbs = Math.max(0.25, Math.max(actualLbs, dimLbs * 0.85));

  return {
    actualLbs: parseFloat(actualLbs.toFixed(2)),
    dimLbs: parseFloat(dimLbs.toFixed(2)),
    billableLbs: parseFloat(billableLbs.toFixed(2)),
  };
}

/**
 * Calculates realistic shipping rates for all supported carrier methods
 * based on package weight, measurements, and distance between seller ZIP and buyer ZIP
 */
export function calculateShippingRates(
  product: Product,
  buyerZip: string = '73159'
): CalculatedShippingRate[] {
  const sellerZip = product.location?.zip || '73159';
  const coord1 = getCoordinatesForZip(sellerZip);
  const coord2 = getCoordinatesForZip(buyerZip);
  const distanceMiles = calculateDistanceInMiles(coord1.lat, coord1.lng, coord2.lat, coord2.lng);
  const zone = getPostalZone(distanceMiles);

  const measurements = product.packageMeasurements || {
    weightLbs: 1,
    weightOz: 8,
    lengthInches: 11,
    widthInches: 9,
    heightInches: 4,
    packageType: 'box',
  };

  const { billableLbs } = calculateBillableWeight(measurements);

  const rates: CalculatedShippingRate[] = [];

  // Check if Seller offers FREE SHIPPING
  if (
    product.shippingOptions.freeShipping ||
    product.shippingOptions.pricingType === 'free_shipping'
  ) {
    rates.push({
      id: 'free',
      carrierKey: 'free_shipping',
      carrierName: 'Free Standard Shipping',
      serviceName: 'Seller-Sponsored Educator Delivery',
      rate: 0,
      estimatedDays: distanceMiles < 500 ? '2-3 business days' : '3-5 business days',
      isFree: true,
      distanceMiles,
      billableWeightLbs: billableLbs,
      zone,
    });
  } else if (
    product.shippingOptions.pricingType === 'flat_rate' ||
    (product.shippingOptions.estimatedFee !== undefined && product.shippingOptions.estimatedFee > 0)
  ) {
    // Seller provided an estimated custom flat fee
    const fee = product.shippingOptions.estimatedFee ?? product.shippingOptions.flatRate ?? 5.50;
    rates.push({
      id: 'usps',
      carrierKey: 'seller_flat_rate',
      carrierName: 'Standard Flat Rate Shipping',
      serviceName: 'Seller Estimated Fixed Rate',
      rate: parseFloat(fee.toFixed(2)),
      estimatedDays: distanceMiles < 500 ? '2-4 business days' : '4-6 business days',
      distanceMiles,
      billableWeightLbs: billableLbs,
      zone,
    });
  } else {
    // AUTOMATIC REAL-TIME CALCULATOR: Real rates based on weight & distance

    // 1. USPS Ground Advantage (Most economical nationwide)
    // Base $4.15 + ($0.75 * billable lbs) + ($0.55 * (zone - 1))
    const uspsGroundPrice = 4.15 + (billableLbs * 0.75) + ((zone - 1) * 0.55);
    rates.push({
      id: 'usps',
      carrierKey: 'usps_ground',
      carrierName: 'USPS Ground Advantage™',
      serviceName: 'Affordable Nationwide Postal Delivery',
      rate: parseFloat(uspsGroundPrice.toFixed(2)),
      estimatedDays: zone <= 4 ? '2-3 business days' : '3-5 business days',
      distanceMiles,
      billableWeightLbs: billableLbs,
      zone,
    });

    // 2. USPS Priority Mail (Fast 2-3 Day with $100 insurance)
    // Base $8.25 + ($1.15 * billable lbs) + ($0.85 * (zone - 1))
    const uspsPriorityPrice = 8.25 + (billableLbs * 1.15) + ((zone - 1) * 0.85);
    rates.push({
      id: 'usps',
      carrierKey: 'usps_priority',
      carrierName: 'USPS Priority Mail®',
      serviceName: '2-3 Day Fast Delivery + $100 Insurance',
      rate: parseFloat(uspsPriorityPrice.toFixed(2)),
      estimatedDays: '1-3 business days',
      distanceMiles,
      billableWeightLbs: billableLbs,
      zone,
    });

    // 3. UPS® Ground (Commercial School Delivery)
    if (product.shippingOptions.ups) {
      // Base $8.95 + ($0.95 * billable lbs) + ($0.70 * (zone - 1))
      const upsPrice = 8.95 + (billableLbs * 0.95) + ((zone - 1) * 0.70);
      rates.push({
        id: 'ups',
        carrierKey: 'ups_ground',
        carrierName: 'UPS® Ground',
        serviceName: 'Reliable School & Doorstep Delivery',
        rate: parseFloat(upsPrice.toFixed(2)),
        estimatedDays: zone <= 3 ? '1-2 business days' : '3-5 business days',
        distanceMiles,
        billableWeightLbs: billableLbs,
        zone,
      });
    }

    // 4. FedEx Home Delivery (if enabled)
    if (product.shippingOptions.fedex) {
      const fedexPrice = 9.40 + (billableLbs * 1.05) + ((zone - 1) * 0.75);
      rates.push({
        id: 'fedex',
        carrierKey: 'fedex_ground',
        carrierName: 'FedEx Home Delivery®',
        serviceName: 'Residential & Campus Delivery',
        rate: parseFloat(fedexPrice.toFixed(2)),
        estimatedDays: '2-5 business days',
        distanceMiles,
        billableWeightLbs: billableLbs,
        zone,
      });
    }
  }

  // 5. Local School Pickup (if seller enabled)
  if (product.shippingOptions.localPickup) {
    rates.push({
      id: 'pickup',
      carrierKey: 'local_pickup',
      carrierName: 'Free Local Campus Pickup',
      serviceName: product.shippingOptions.pickupInstructions || 'Safe pickup at school main office',
      rate: 0,
      estimatedDays: 'Same-day / Arranged with Seller',
      isPickup: true,
      distanceMiles,
      billableWeightLbs: billableLbs,
      zone,
    });
  }

  return rates;
}

/**
 * Returns a user-friendly summary of package specs
 */
export function formatPackageSpecs(measurements?: PackageMeasurements): string {
  if (!measurements) return '1.5 lbs • Standard Box';
  const totalLbs = measurements.weightLbs + measurements.weightOz / 16;
  const dimStr = `${measurements.lengthInches}" × ${measurements.widthInches}" × ${measurements.heightInches}"`;
  return `${totalLbs.toFixed(1)} lbs (${measurements.weightLbs} lb ${measurements.weightOz} oz) • ${dimStr}`;
}
