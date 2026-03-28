type EventPayload = Record<string, unknown>;

export function logProductEvent(event: string, payload: EventPayload = {}) {
  const entry = {
    event,
    payload,
    timestamp: new Date().toISOString(),
  };
  console.info('[verdiMobility:event]', entry);
}
