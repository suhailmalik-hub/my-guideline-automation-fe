const SSE_API_KEY = import.meta.env.VITE_SSE_API_KEY;

const SSE_URL = `${import.meta.env.VITE_API_BASE_URL}/sse/events?apiKey=${SSE_API_KEY}`;

let _sharedClient: EventSource | null = null;

/**
 * Returns the single shared EventSource for this browser tab.
 * Creates it on first call; re-creates it only if the previous connection was closed.
 */
export const createSseClient = (): EventSource => {
  if (!_sharedClient || _sharedClient.readyState === EventSource.CLOSED) {
    _sharedClient = new EventSource(SSE_URL);
  }
  return _sharedClient;
};

let _sseClientId: string | null = null;

export const setSseClientId = (id: string): void => {
  _sseClientId = id;
};

/**
 * Returns the SSE client ID assigned by the server on connection.
 * Returns null if the SSE connection has not been established yet.
 */
export const getSseClientId = (): string | null => _sseClientId;
