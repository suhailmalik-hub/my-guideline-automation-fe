const TAB_ID_PREFIX = 'neuron_tab:';

/**
 * Returns the unique ID of the current browser tab using `window.name`.
 *
 * `window.name` is a property of the browsing context (the tab) itself — not a
 * storage API. It is isolated per tab and survives same-tab page navigations and
 * refreshes. Opening a new tab or duplicating one starts with an empty `window.name`,
 * so each tab receives its own distinct ID.
 */
export function getTabId(): string {
  try {
    if (window.name.startsWith(TAB_ID_PREFIX)) {
      return window.name.slice(TAB_ID_PREFIX.length);
    }

    const id = crypto.randomUUID();
    window.name = `${TAB_ID_PREFIX}${id}`;
    return id;
  } catch (error) {
    throw new Error(`Failed to retrieve browser tab ID: ${error instanceof Error ? error.message : error}`);
  }
}
