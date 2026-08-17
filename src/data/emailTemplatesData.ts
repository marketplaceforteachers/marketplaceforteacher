import { EmailTemplate, EmailLog } from '../types';

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tpl-welcome',
    trigger: 'User Registration',
    name: 'Welcome to Marketplace For Teachers',
    subject: 'Welcome to the Educator Community at MarketplaceForTeachers.com! 🍎',
    previewText: 'Start browsing affordable classroom resources and connecting with fellow verified teachers.',
    category: 'Drip Campaign',
    active: true,
    sentCount: 1842,
    openRate: '78.4%',
    clickRate: '42.1%',
    htmlContent: `
<div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
  <div style="background: #1e3a8a; padding: 24px; text-align: center; color: white;">
    <h1 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">MarketplaceForTeachers.com</h1>
    <p style="margin: 4px 0 0 0; font-size: 13px; color: #93c5fd;">Empowering America's Educators • Classroom Materials Exchange</p>
  </div>
  <div style="padding: 32px 24px; color: #334155; line-height: 1.6;">
    <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Welcome to your educator marketplace, {{user_name}}!</h2>
    <p>We are delighted to have you join our verified community of educators. Whether you are stocking your classroom library, sourcing hands-on STEM manipulatives, or passing along quality materials to save another teacher's budget, you are in good hands.</p>
    <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 16px; border-radius: 0 8px 8px 0; margin: 24px 0;">
      <h4 style="margin: 0 0 8px 0; color: #1e40af;">Next Steps to Get Started:</h4>
      <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
        <li><strong>Verify your Educator Status</strong> to unlock the verified badge & special school discounts.</li>
        <li><strong>List unused classroom supplies</strong> with zero upfront listing fees.</li>
        <li><strong>Set your ZIP code radius</strong> for instant local contact-free pickups.</li>
      </ul>
    </div>
    <div style="text-align: center; margin: 32px 0;">
      <a href="{{browse_url}}" style="background: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Explore Classroom Materials</a>
    </div>
  </div>
  <div style="background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
    <p style="margin: 0 0 4px 0;"><strong>MarketplaceForTeachers.com, LLC</strong></p>
    <p style="margin: 0;">9905 S Pennsylvania Ave Ste A, Oklahoma City, OK 73159, USA • (405) 555-8322</p>
    <p style="margin: 8px 0 0 0;"><a href="{{unsubscribe_url}}" style="color: #64748b; text-decoration: underline;">Manage Email Preferences</a> | <a href="{{privacy_url}}" style="color: #64748b; text-decoration: underline;">Privacy Policy</a></p>
  </div>
</div>
    `,
  },
  {
    id: 'tpl-order-conf',
    trigger: 'Checkout Complete',
    name: 'Order Confirmation & Receipt',
    subject: 'Order Confirmed: #{{order_number}} from MarketplaceForTeachers.com',
    previewText: 'Thank you for your order! Here is your itemized invoice and shipping summary.',
    category: 'Transactional',
    active: true,
    sentCount: 940,
    openRate: '94.2%',
    clickRate: '68.5%',
    htmlContent: `
<div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
  <div style="background: #1e3a8a; padding: 24px; text-align: center; color: white;">
    <h1 style="margin: 0; font-size: 22px; font-weight: 700;">Order Confirmed!</h1>
    <p style="margin: 4px 0 0 0; font-size: 14px; color: #93c5fd;">Order #{{order_number}} • {{order_date}}</p>
  </div>
  <div style="padding: 28px 24px; color: #334155;">
    <p>Hi {{buyer_name}},</p>
    <p>Thank you for supporting fellow teachers! The seller has received your order and is packing your classroom items.</p>
    
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
      <thead>
        <tr style="border-bottom: 2px solid #e2e8f0; text-align: left;">
          <th style="padding: 8px 0; color: #64748b;">Item Description</th>
          <th style="padding: 8px 0; text-align: center; color: #64748b;">Qty</th>
          <th style="padding: 8px 0; text-align: right; color: #64748b;">Price</th>
        </tr>
      </thead>
      <tbody>
        {{item_rows}}
      </tbody>
      <tfoot>
        <tr style="border-top: 1px solid #e2e8f0;">
          <td colspan="2" style="padding: 6px 0; text-align: right; color: #64748b;">Subtotal:</td>
          <td style="padding: 6px 0; text-align: right; font-weight: 600;">\${{subtotal}}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 6px 0; text-align: right; color: #64748b;">Shipping:</td>
          <td style="padding: 6px 0; text-align: right; font-weight: 600;">\${{shipping_total}}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 6px 0; text-align: right; color: #64748b;">Sales Tax ({{state_rate}}%):</td>
          <td style="padding: 6px 0; text-align: right; font-weight: 600;">\${{tax_total}}</td>
        </tr>
        <tr style="border-top: 2px solid #0f172a; font-size: 16px;">
          <td colspan="2" style="padding: 10px 0; text-align: right; font-weight: 700; color: #0f172a;">Total Paid:</td>
          <td style="padding: 10px 0; text-align: right; font-weight: 700; color: #1e3a8a;">\${{grand_total}}</td>
        </tr>
      </tfoot>
    </table>
    
    <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 13px;">
      <p style="margin: 0 0 4px 0; font-weight: 600; color: #0f172a;">Shipping Address / School Destination:</p>
      <p style="margin: 0; color: #475569;">{{shipping_address_formatted}}</p>
    </div>
    
    <div style="text-align: center; margin: 28px 0;">
      <a href="{{invoice_url}}" style="background: #1e3a8a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Download Official School PDF Invoice</a>
    </div>
  </div>
  <div style="background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b;">
    MarketplaceForTeachers.com • 9905 S Pennsylvania Ave Ste A, Oklahoma City, OK 73159, USA
  </div>
</div>
    `,
  },
  {
    id: 'tpl-listing-sold',
    trigger: 'Item Purchased',
    name: 'Listing Sold Alert for Sellers',
    subject: '🎉 Great news! Your classroom item just sold on MarketplaceForTeachers.com',
    previewText: 'A teacher just bought your item. Here are the packing and shipping instructions.',
    category: 'Transactional',
    active: true,
    sentCount: 680,
    openRate: '96.8%',
    clickRate: '75.2%',
    htmlContent: `
<div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
  <div style="background: #059669; padding: 24px; text-align: center; color: white;">
    <h1 style="margin: 0; font-size: 22px; font-weight: 700;">Congratulations, {{seller_name}}!</h1>
    <p style="margin: 4px 0 0 0; font-size: 14px; color: #a7f3d0;">Your listing has found a new classroom!</p>
  </div>
  <div style="padding: 28px 24px; color: #334155;">
    <p>Good news! <strong>{{buyer_name}}</strong> from <strong>{{buyer_school}}</strong> just purchased:</p>
    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 8px; margin: 16px 0;">
      <h3 style="margin: 0 0 4px 0; color: #166534;">{{product_title}}</h3>
      <p style="margin: 0; font-size: 14px; color: #15803d;">Sale Price: \${{price}} | Your Payout (after 5% platform fee): <strong>\${{net_payout}}</strong></p>
    </div>
    <p>Please prepare the parcel and dispatch via <strong>{{shipping_carrier}}</strong> or coordinate contact-free pickup within 2 business days.</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="{{seller_orders_url}}" style="background: #059669; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">View Order & Print Packing Slip</a>
    </div>
  </div>
  <div style="background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b;">
    MarketplaceForTeachers.com • 9905 S Pennsylvania Ave Ste A, Oklahoma City, OK 73159, USA
  </div>
</div>
    `,
  },
  {
    id: 'tpl-teacher-appreciation',
    trigger: 'Campaign / Annual Schedule',
    name: 'Teacher Appreciation Week Special Promotion',
    subject: '🍎 Happy Teacher Appreciation Week! Here is $15 toward your classroom supplies',
    previewText: 'Use code APPRECIATION to stock up your classroom library and STEM stations.',
    category: 'Promotional',
    active: true,
    sentCount: 4200,
    openRate: '81.2%',
    clickRate: '56.0%',
    htmlContent: `
<div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
  <div style="background: #dc2626; padding: 28px; text-align: center; color: white;">
    <h1 style="margin: 0; font-size: 24px; font-weight: 800;">Thank You, Teachers! 🍎</h1>
    <p style="margin: 6px 0 0 0; font-size: 15px; color: #fecaca;">Celebrating your boundless dedication to students everywhere</p>
  </div>
  <div style="padding: 32px 24px; color: #334155; text-align: center;">
    <p style="font-size: 16px; line-height: 1.6;">Educators spend hundreds of dollars out of pocket every year. In honor of Teacher Appreciation, take <strong>$15 OFF</strong> your next order of $60 or more with code:</p>
    <div style="background: #fef2f2; border: 2px dashed #ef4444; display: inline-block; padding: 12px 32px; border-radius: 8px; font-size: 22px; font-weight: 800; color: #b91c1c; letter-spacing: 2px; margin: 16px 0;">
      APPRECIATION
    </div>
    <p style="font-size: 13px; color: #64748b;">Valid across all categories including Classroom Furniture, Leveled Readers, STEM Labs, and Electronics.</p>
    <div style="margin-top: 24px;">
      <a href="{{marketplace_url}}" style="background: #dc2626; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block;">Shop Teacher Listings Now</a>
    </div>
  </div>
  <div style="background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b;">
    MarketplaceForTeachers.com • 9905 S Pennsylvania Ave Ste A, Oklahoma City, OK 73159, USA
  </div>
</div>
    `,
  },
  {
    id: 'tpl-verify-email',
    trigger: 'Teacher Badge Verification Request',
    name: 'Educator Credential Verification Approved',
    subject: '✅ Your Teacher Verification Badge is Active on MarketplaceForTeachers.com',
    previewText: 'Your K-12 teaching certificate has been approved by our admin team.',
    category: 'System',
    active: true,
    sentCount: 1120,
    openRate: '91.0%',
    clickRate: '62.4%',
    htmlContent: `
<div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
  <div style="background: #1e3a8a; padding: 24px; text-align: center; color: white;">
    <h1 style="margin: 0; font-size: 22px; font-weight: 700;">Verified Educator Badge Granted!</h1>
    <p style="margin: 4px 0 0 0; font-size: 14px; color: #93c5fd;">School: {{school_name}} ({{district_name}})</p>
  </div>
  <div style="padding: 28px 24px; color: #334155;">
    <p>Hi {{user_name}},</p>
    <p>Our administrator verification team has verified your educational credentials. Your profile and product listings now prominently display the <strong>Verified Teacher Badge</strong>.</p>
    <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 16px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: #1e40af;"><strong>Benefits of your Verified Status:</strong></p>
      <ul style="margin: 8px 0 0 0; padding-left: 20px; font-size: 13px; color: #1e3a8a;">
        <li>Higher buyer confidence on your classroom listings.</li>
        <li>Priority access to district-level surplus furniture sales.</li>
        <li>Access to 1099-K tax summary tools for school expense write-offs.</li>
      </ul>
    </div>
    <div style="text-align: center; margin: 24px 0;">
      <a href="{{dashboard_url}}" style="background: #1e3a8a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Go to Teacher Dashboard</a>
    </div>
  </div>
  <div style="background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b;">
    MarketplaceForTeachers.com • 9905 S Pennsylvania Ave Ste A, Oklahoma City, OK 73159, USA
  </div>
</div>
    `,
  },
  {
    id: 'tpl-shipping-reminder',
    trigger: 'Shipment Tracking Created',
    name: 'Package In-Transit Notification',
    subject: '📦 Your classroom items are on the way! Tracking: {{tracking_number}}',
    previewText: 'Track your package with {{carrier_name}} as it makes its way to your school.',
    category: 'Transactional',
    active: true,
    sentCount: 780,
    openRate: '93.5%',
    clickRate: '79.1%',
    htmlContent: `
<div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
  <div style="background: #1e3a8a; padding: 24px; text-align: center; color: white;">
    <h1 style="margin: 0; font-size: 22px; font-weight: 700;">Your Package is In Transit!</h1>
    <p style="margin: 4px 0 0 0; font-size: 14px; color: #93c5fd;">Carrier: {{carrier_name}} • Tracking #{{tracking_number}}</p>
  </div>
  <div style="padding: 28px 24px; color: #334155;">
    <p>Hi {{buyer_name}},</p>
    <p>Great news! <strong>{{seller_name}}</strong> has handed over your package to {{carrier_name}}.</p>
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
      <p style="margin: 0 0 4px 0; font-size: 13px; color: #64748b;">Tracking Number:</p>
      <p style="margin: 0; font-size: 16px; font-weight: 700; color: #0f172a; font-family: monospace;">{{tracking_number}}</p>
    </div>
    <div style="text-align: center; margin: 24px 0;">
      <a href="{{tracking_url}}" style="background: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Track Shipment Live</a>
    </div>
  </div>
  <div style="background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b;">
    MarketplaceForTeachers.com • 9905 S Pennsylvania Ave Ste A, Oklahoma City, OK 73159, USA
  </div>
</div>
    `,
  },
];

export const MOCK_EMAIL_LOGS: EmailLog[] = [
  { id: 'elog-1', recipient: 'sjenkins@okcps.org', templateName: 'Educator Credential Verification Approved', subject: '✅ Your Teacher Verification Badge is Active', sentAt: '2026-08-06 14:10', status: 'Opened' },
  { id: 'elog-2', recipient: 'dmartinez@dallasisd.org', templateName: 'Listing Sold Alert for Sellers', subject: '🎉 Great news! Your classroom item just sold', sentAt: '2026-08-04 16:30', status: 'Clicked' },
  { id: 'elog-3', recipient: 'sjenkins@okcps.org', templateName: 'Order Confirmation & Receipt', subject: 'Order Confirmed: #MFT-2026-8942', sentAt: '2026-08-04 15:45', status: 'Opened' },
  { id: 'elog-4', recipient: 'ethornton@austincharter.edu', templateName: 'Welcome to Marketplace For Teachers', subject: 'Welcome to the Educator Community! 🍎', sentAt: '2026-08-02 09:12', status: 'Opened' },
];
