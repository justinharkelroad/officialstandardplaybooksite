// Shared by the browser and Cloudflare's static HTML stamper. Offer URLs lead
// to the public pricing chooser, where existing-customer safeguards apply.
const pageUrl = 'https://standardplaybook.com/boardroom';

export const boardroomServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${pageUrl}#service`,
  name: 'The Boardroom',
  url: pageUrl,
  description: 'Weekly Monday coaching and the Domino accountability loop for insurance agency owners. Choose Boardroom with Agency Brain Core for $399/month, Boardroom Plus for $549/month, or Boardroom Pro for $699/month.',
  provider: { '@type': 'Organization', name: 'The Standard Playbook', url: 'https://standardplaybook.com' },
  serviceType: 'Business Coaching Mastermind & Agency Operating Software',
  audience: { '@type': 'Audience', audienceType: 'Insurance Agency Owners, Principal Agents, and Key Leaders' },
  areaServed: { '@type': 'Country', name: 'United States' },
  offers: [
    { name: 'Boardroom', software: 'Agency Brain Core', price: '399', description: 'Boardroom membership with Agency Brain Core ($299/month standalone value) included. 20 AI call scores per month.' },
    { name: 'Boardroom Plus', software: 'Agency Brain Plus', price: '549', description: '$399 Boardroom membership plus the $150 Plus software layer. Includes 50 AI call scores per month, Video Architect, Training AI Builder and 240 AI Training Studio minutes per month.' },
    { name: 'Boardroom Pro', software: 'Agency Brain Pro', price: '699', description: '$399 Boardroom membership plus the $300 Pro software layer. Includes everything in Plus, 100 AI call scores per month, 600 Studio roleplay minutes per month, HR Suite and priority support.' },
  ].map(({ name, software, price, description }) => ({
    '@type': 'Offer',
    name,
    description,
    url: `${pageUrl}#pricing`,
    price,
    priceCurrency: 'USD',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price,
      priceCurrency: 'USD',
      unitCode: 'MON',
      unitText: 'MONTH',
      billingIncrement: 1,
    },
    itemOffered: { '@type': 'Service', name: `${name} with ${software}` },
  })),
};
