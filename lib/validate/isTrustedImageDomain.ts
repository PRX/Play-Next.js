/**
 * @file isTrustedImageDomain.ts
 * Helper function to return JSX for image component appropriate for a domain.
 */

export const trustedDomains = ['f.prxu.org'];

const isTrustedImageDomain = (url: string) => {
  const isTrusted = trustedDomains.reduce(
    (trusted, domain) =>
      trusted || new RegExp(`^(https?:)?//${domain}/`).test(url),
    false
  );

  return isTrusted;
};

export default isTrustedImageDomain;
