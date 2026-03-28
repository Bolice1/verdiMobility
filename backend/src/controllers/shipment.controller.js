import * as shipmentService from '../services/shipment.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const create = asyncHandler(async (req, res) => {
  const created = await shipmentService.createShipment(req.user, req.body);
  res.status(201).json(created);
});

export const list = asyncHandler(async (req, res) => {
  const result = await shipmentService.listShipments(req.user, req.query);
  res.json(result);
});

export const getById = asyncHandler(async (req, res) => {
  const row = await shipmentService.getShipmentById(req.user, req.params.id);
  res.json(row);
});

export const patchStatus = asyncHandler(async (req, res) => {
  const updated = await shipmentService.updateShipmentStatus(
    req.user,
    req.params.id,
    req.body.status,
  );
  res.json(updated);
});
