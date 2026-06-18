import enLabels from '@/Neuron/themes/en.json';

/**
 * Retrieves a nested label from the centralized labels dictionary.
 *
 * Usage:
 *    t('usersInfo.title')
 *
 * @param path The nested object path (e.g., 'usersInfo.title')
 * @returns The string value from the json file.
 */
export const t = (path: string): string => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dictionary: Record<string, any> = enLabels;

  // split nested keys, e.g., 'usersInfo.title' -> ['usersInfo', 'title']
  const keys = path.split('.');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = dictionary;
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      // Return a fallback so developers know it's a missing translation
      return path;
    }
  }

  // Return the string value if found, otherwise the fallback
  if (typeof current === 'string') {
    return current;
  }

  return path;
};
