import type { AuthTokens, Vehicle } from '../types';

export type VehicleRealtimeEvent = {
  type: 'vehicle.update';
  event: 'created' | 'updated' | 'location';
  vehicle: Vehicle;
  meta?: Record<string, unknown>;
  timestamp: string;
};

export type RealtimeMessage =
  | VehicleRealtimeEvent
  | {
      type: 'connection.ready';
      timestamp: string;
    };

export type RealtimeTokenProvider = () =>
  | Promise<Partial<AuthTokens> | null>
  | Partial<AuthTokens>
  | null;

export function createVehicleRealtimeConnection(
  baseUrl: string,
  getTokens: RealtimeTokenProvider,
  onMessage: (message: RealtimeMessage) => void,
) {
  let socket: WebSocket | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let closedManually = false;

  const buildUrl = async () => {
    const tokens = await getTokens();
    if (!tokens?.accessToken) return null;
    const url = new URL('/ws/vehicles', baseUrl);
    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    url.searchParams.set('token', tokens.accessToken);
    return url.toString();
  };

  const connect = async () => {
    const url = await buildUrl();
    if (!url || closedManually) return;

    socket = new WebSocket(url);

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(String(event.data)) as RealtimeMessage;
        onMessage(payload);
      } catch {
        return;
      }
    };

    socket.onclose = () => {
      socket = null;
      if (!closedManually) {
        reconnectTimer = setTimeout(() => {
          void connect();
        }, 1500);
      }
    };
  };

  void connect();

  return {
    close() {
      closedManually = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      socket?.close();
    },
  };
}
