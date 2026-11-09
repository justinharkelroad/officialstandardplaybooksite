export type AdvisorBrand = 'standard' | 'agencybrain' | 'livecallcoach';
const hosts: Record<AdvisorBrand, string[]> = {
  standard: ['standardplaybook.com', 'www.standardplaybook.com'],
  agencybrain: ['myagencybrain.com', 'www.myagencybrain.com'],
  livecallcoach: ['livecallcoach.ai', 'www.livecallcoach.ai'],
};
/** The only public pages the advisor is allowed on. */
const allowedPaths = ['/', '/start'];
export function advisorAllowed(brand: AdvisorBrand, hostname: string, pathname: string, development = false): boolean {
  if (!allowedPaths.includes(pathname)) return false;
  return hosts[brand].includes(hostname.toLowerCase()) || (development && ['localhost', '127.0.0.1'].includes(hostname));
}
