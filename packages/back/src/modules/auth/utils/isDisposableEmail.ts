import { isFakeEmail } from 'fakefilter';
import { readFileSync } from 'fs';

function hostnameFromEmailAddress(email: string) {
  if (email && typeof email === 'string' && email.search(/@/) > 0)
    return email.split(/@/)[1];
  return null;
}

const disposableDomainsJSON = readFileSync('./disposableDomains.json', {
  encoding: 'utf8',
});
const disposableDomainsObject = JSON.parse(disposableDomainsJSON);

function customIsFakeDomain(domain: string) {
  const customDomains: string[] = disposableDomainsObject.domains;
  for (const dom of customDomains) {
    // exact match
    if (dom === domain.toLowerCase().trim()) return dom;
    // subdomain match
    if (domain.search(new RegExp(`.+\\.${dom}`)) === 0) return dom;
  }
  return false;
}

function customIsFakeEmail(email) {
  return customIsFakeDomain(hostnameFromEmailAddress(email));
}

export const isDisposableEmail = (email: string): boolean => {
  return !!isFakeEmail(email) || !!customIsFakeEmail(email);
};
