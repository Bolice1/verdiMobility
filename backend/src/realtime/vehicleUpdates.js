import { WebSocket, WebSocketServer } from 'ws';

import { verifyAccessToken } from '../utils/jwt.js';
import { logger } from '../utils/logger.js';

let wss;
const clients = new Set();

function send(socket, payload) {
  if (socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify(payload));
}

function parseToken(requestUrl) {
  try {
    const url = new URL(requestUrl, 'http://localhost');
    return url.searchParams.get('token');
  } catch {
    return null;
  }
}

export function attachVehicleRealtimeServer(server) {
  wss = new WebSocketServer({
    server,
    path: '/ws/vehicles',
  });

  wss.on('connection', (socket, request) => {
    const token = parseToken(request.url);
    if (!token) {
      socket.close(4401, 'Missing token');
      return;
    }

    try {
      const decoded = verifyAccessToken(token);
      socket.user = {
        id: decoded.sub,
        role: decoded.role,
        companyId: decoded.companyId ?? null,
      };
      clients.add(socket);
      send(socket, {
        type: 'connection.ready',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      socket.close(4401, 'Invalid token');
      return;
    }

    socket.on('close', () => {
      clients.delete(socket);
    });

    socket.on('error', (error) => {
      logger.warn('Vehicle websocket client error', {
        message: error?.message,
      });
      clients.delete(socket);
    });
  });

  logger.info('Vehicle realtime WebSocket server attached');
}

function shouldReceive(socket, payload) {
  if (!socket.user) return false;
  if (socket.user.role === 'admin') return true;

  const vehicle = payload.vehicle;
  if (!vehicle) return true;

  if (socket.user.role === 'company') {
    return socket.user.companyId && socket.user.companyId === vehicle.companyId;
  }

  return true;
}

export function publishVehicleUpdate(event, vehicle, meta = {}) {
  if (!wss) return;

  const payload = {
    type: 'vehicle.update',
    event,
    vehicle,
    meta,
    timestamp: new Date().toISOString(),
  };

  for (const socket of clients) {
    if (shouldReceive(socket, payload)) {
      send(socket, payload);
    }
  }
}
