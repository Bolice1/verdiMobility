import * as driverModel from '../models/driver.model.js';
import * as userModel from '../models/user.model.js';
import * as vehicleModel from '../models/vehicle.model.js';
import { logger } from '../utils/logger.js';
import * as emailService from './email.service.js';

function normalizeShipment(row) {
  if (!row) return null;
  return {
    id: row.id,
    pickupLocation: row.pickupLocation ?? row.pickup_location,
    destination: row.destination,
    status: row.status,
    weight: row.weight,
    price: row.price,
    senderId: row.senderId ?? row.sender_id,
    vehicleId: row.vehicleId ?? row.vehicle_id,
  };
}

export function queueShipmentStatusEmails({
  shipment,
  previousStatus,
  nextStatus,
  requestId,
}) {
  setImmediate(() => {
    const s = normalizeShipment(shipment);
    if (!s?.senderId) return;

    userModel
      .findUserEmailAndNameById(s.senderId)
      .then(async (sender) => {
        if (!sender?.email) return;
        const base = { to: sender.email, name: sender.name, shipment: s, requestId };
        let driver;

        if (s.vehicleId && nextStatus === 'matched') {
          const vehicle = await vehicleModel.findVehicleById(s.vehicleId);
          if (vehicle?.driverId) {
            driver = await driverModel.findDriverWithUserById(vehicle.driverId);
          }
        }

        switch (nextStatus) {
          case 'matched':
            emailService.queueShipmentMatchedEmail({
              ...base,
              driver: driver
                ? { name: driver.name, licenseNumber: driver.licenseNumber }
                : null,
            });
            break;
          case 'in_transit':
            emailService.queueShipmentPickedUpEmail(base);
            break;
          case 'delivered':
            emailService.queueShipmentDeliveredEmail(base);
            break;
          case 'cancelled':
            emailService.queueShipmentCancelledEmail({
              ...base,
              reason: 'Status updated to cancelled',
            });
            break;
          default:
            break;
        }
      })
      .catch((e) =>
        logger.error('Shipment status email queue failed', {
          message: e?.message,
          requestId,
        }),
      );
  });
}
