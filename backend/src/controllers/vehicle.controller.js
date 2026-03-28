import * as vehicleService from '../services/vehicle.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const create = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.createVehicle(req.user, req.body);
  res.status(201).json(vehicle);
});

export const list = asyncHandler(async (req, res) => {
  const result = await vehicleService.listVehicles(req.user, req.query);
  res.json(result);
});

export const patch = asyncHandler(async (req, res) => {
  const updated = await vehicleService.updateVehicle(req.user, req.params.id, req.body);
  res.json(updated);
});

export const marketplace = asyncHandler(async (req, res) => {
  const result = await vehicleService.listMarketplaceVehicles(req.query);
  res.json(result);
});
