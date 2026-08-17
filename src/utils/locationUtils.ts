export interface USState {
  code: string;
  name: string;
}

export const US_STATES_LIST: USState[] = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'DC', name: 'District of Columbia' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
];

export const STATE_CODE_TO_NAME: Record<string, string> = {};
export const STATE_NAME_TO_CODE: Record<string, string> = {};

US_STATES_LIST.forEach((st) => {
  STATE_CODE_TO_NAME[st.code.toUpperCase()] = st.name;
  STATE_NAME_TO_CODE[st.name.toLowerCase()] = st.code.toUpperCase();
});

/**
 * Returns the full state name for a 2-letter code (e.g. 'OK' -> 'Oklahoma')
 */
export function getStateFullName(stateCodeOrName: string): string {
  if (!stateCodeOrName) return '';
  const upper = stateCodeOrName.trim().toUpperCase();
  if (STATE_CODE_TO_NAME[upper]) return STATE_CODE_TO_NAME[upper];
  return stateCodeOrName;
}

/**
 * Returns the 2-letter code for a state name (e.g. 'Oklahoma' -> 'OK')
 */
export function getStateCode(stateNameOrCode: string): string {
  if (!stateNameOrCode) return '';
  const trimmed = stateNameOrCode.trim();
  const lower = trimmed.toLowerCase();
  if (STATE_NAME_TO_CODE[lower]) return STATE_NAME_TO_CODE[lower];
  if (trimmed.length === 2 && STATE_CODE_TO_NAME[trimmed.toUpperCase()]) {
    return trimmed.toUpperCase();
  }
  return trimmed;
}

/**
 * Checks if a location (city, state, zip) matches a search term
 */
/**
 * Checks if a location (city, state, zip) matches a search term
 */
export function isLocationMatchingQuery(
  loc: { city?: string; state?: string; zip?: string } | undefined,
  query: string
): boolean {
  if (!loc || !query) return false;
  const q = query.trim().toLowerCase();
  if (!q) return false;

  // Check city match
  if (loc.city && loc.city.toLowerCase().includes(q)) {
    return true;
  }

  // Check zip match
  if (loc.zip && loc.zip.toLowerCase().includes(q)) {
    return true;
  }

  // Check state 2-letter code match
  if (loc.state) {
    const stCode = loc.state.trim().toLowerCase();
    if (stCode === q || stCode.includes(q)) {
      return true;
    }
    // Check full state name match
    const fullName = getStateFullName(loc.state).toLowerCase();
    if (fullName.includes(q) || q.includes(fullName)) {
      return true;
    }
  }

  return false;
}

export const MAJOR_US_CITIES = [
  { city: 'Oklahoma City', state: 'OK', zip: '73159', label: 'Oklahoma City, OK (MFT HQ)' },
  { city: 'New York City', state: 'NY', zip: '10001', label: 'New York City, NY' },
  { city: 'Brooklyn', state: 'NY', zip: '11201', label: 'Brooklyn, NY' },
  { city: 'Queens', state: 'NY', zip: '11375', label: 'Queens, NY' },
  { city: 'Buffalo', state: 'NY', zip: '14201', label: 'Buffalo, NY' },
  { city: 'Dallas', state: 'TX', zip: '75201', label: 'Dallas, TX' },
  { city: 'Austin', state: 'TX', zip: '78701', label: 'Austin, TX' },
  { city: 'Houston', state: 'TX', zip: '77001', label: 'Houston, TX' },
  { city: 'Los Angeles', state: 'CA', zip: '90001', label: 'Los Angeles, CA' },
  { city: 'San Francisco', state: 'CA', zip: '94102', label: 'San Francisco, CA' },
  { city: 'Chicago', state: 'IL', zip: '60601', label: 'Chicago, IL' },
  { city: 'Miami', state: 'FL', zip: '33101', label: 'Miami, FL' },
  { city: 'Atlanta', state: 'GA', zip: '30301', label: 'Atlanta, GA' },
  { city: 'Seattle', state: 'WA', zip: '98101', label: 'Seattle, WA' },
  { city: 'Denver', state: 'CO', zip: '80202', label: 'Denver, CO' },
  { city: 'Phoenix', state: 'AZ', zip: '85001', label: 'Phoenix, AZ' },
  { city: 'Philadelphia', state: 'PA', zip: '19102', label: 'Philadelphia, PA' },
  { city: 'Boston', state: 'MA', zip: '02108', label: 'Boston, MA' },
];

export const ZIP_TO_LOCATION: Record<string, { city: string; state: string }> = {
  '73159': { city: 'Oklahoma City', state: 'OK' },
  '73108': { city: 'Oklahoma City', state: 'OK' },
  '73013': { city: 'Edmond', state: 'OK' },
  '74103': { city: 'Tulsa', state: 'OK' },
  '10001': { city: 'New York', state: 'NY' },
  '11201': { city: 'Brooklyn', state: 'NY' },
  '11375': { city: 'Queens', state: 'NY' },
  '14201': { city: 'Buffalo', state: 'NY' },
  '75201': { city: 'Dallas', state: 'TX' },
  '78701': { city: 'Austin', state: 'TX' },
  '77001': { city: 'Houston', state: 'TX' },
  '90001': { city: 'Los Angeles', state: 'CA' },
  '94102': { city: 'San Francisco', state: 'CA' },
  '60601': { city: 'Chicago', state: 'IL' },
  '33101': { city: 'Miami', state: 'FL' },
  '30301': { city: 'Atlanta', state: 'GA' },
  '98101': { city: 'Seattle', state: 'WA' },
  '80202': { city: 'Denver', state: 'CO' },
  '85001': { city: 'Phoenix', state: 'AZ' },
  '19102': { city: 'Philadelphia', state: 'PA' },
  '02108': { city: 'Boston', state: 'MA' },
};

/**
 * Formats a location display label from a ZIP code or city/state
 */
export function formatLocationLabel(zipOrQuery: string): string {
  if (!zipOrQuery) return 'USA (All Regions)';
  const clean = zipOrQuery.trim();
  if (ZIP_TO_LOCATION[clean]) {
    return `${ZIP_TO_LOCATION[clean].city}, ${ZIP_TO_LOCATION[clean].state} (${clean})`;
  }
  // If it's a 5 digit zip
  if (/^\d{5}$/.test(clean)) {
    return `ZIP ${clean}`;
  }
  return clean;
}

/**
 * Resolves user input (city, state, or zip) to a standardized zip code
 */
export function resolveLocationInputToZip(input: string): { zip: string; display: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { zip: '73159', display: 'Oklahoma City, OK (73159)' };
  }

  // If already 5 digits
  if (/^\d{5}$/.test(trimmed)) {
    const loc = ZIP_TO_LOCATION[trimmed];
    return {
      zip: trimmed,
      display: loc ? `${loc.city}, ${loc.state} (${trimmed})` : `ZIP ${trimmed}`,
    };
  }

  // Look for matching city
  const lower = trimmed.toLowerCase();
  const matchedCity = MAJOR_US_CITIES.find(
    (c) =>
      c.city.toLowerCase() === lower ||
      c.city.toLowerCase().includes(lower) ||
      lower.includes(c.city.toLowerCase())
  );
  if (matchedCity) {
    return {
      zip: matchedCity.zip,
      display: `${matchedCity.city}, ${matchedCity.state} (${matchedCity.zip})`,
    };
  }

  // Check state match
  const stCode = getStateCode(trimmed);
  if (stCode && stCode.length === 2) {
    const cityInState = MAJOR_US_CITIES.find((c) => c.state === stCode);
    if (cityInState) {
      return {
        zip: cityInState.zip,
        display: `${cityInState.city}, ${cityInState.state} (${cityInState.zip})`,
      };
    }
  }

  return { zip: '73159', display: trimmed };
}
