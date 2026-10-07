/**
 * CPM & Direct Monetization Network Links
 */

export const AD_LINKS = {
  primary: 'https://www.profitableratecpmnetwork.com/kzvchd11y?key=523aa01bebefab510e0565331aaae12d',
  secondary: 'https://www.profitableratecpmnetwork.com/hnvrbbpa?key=e2373d4afd649b895454989562a88134',
};

let adCounter = 0;

export function getNextAdUrl(): string {
  const url = adCounter % 2 === 0 ? AD_LINKS.primary : AD_LINKS.secondary;
  adCounter++;
  return url;
}

export function triggerAdClick(): string {
  const url = getNextAdUrl();
  try {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (win) {
      win.focus();
    }
  } catch (e) {
    console.error('Ad popup blocked or failed:', e);
  }
  return url;
}
