// Utility to resolve paths correctly regardless of whether the site is hosted 
// on a root domain (e.g., zenith.com) or a subpath (e.g., github.io/zenith/)

export function resolvePath(path: string) {
  // If the path is an external link or an anchor link, leave it alone
  if (path.startsWith('http') || path.startsWith('#')) {
    return path;
  }

  // Get the base URL configured in astro.config.mjs (defaults to '/')
  const base = import.meta.env.BASE_URL;
  
  // If the path starts with a slash, strip it and append to base
  // (Base URL is guaranteed to end with a slash by Astro)
  if (path.startsWith('/')) {
    return `${base}${path.slice(1)}`;
  }
  
  return path;
}
