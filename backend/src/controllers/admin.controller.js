import * as adminService from '../services/admin.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { paginationMeta } from '../utils/pagination.js';

export const overview = asyncHandler(async (_req, res) => {
  const data = await adminService.getOverview();
  res.json({ success: true, data });
});

export const companies = asyncHandler(async (req, res) => {
  const { limit, offset } = req.query;
  const { items, total } = await adminService.listCompaniesGlobal({ limit, offset });
  res.json({
    success: true,
    data: {
      items,
      meta: paginationMeta({ total, limit, offset }),
    },
  });
});

export const vehicles = asyncHandler(async (req, res) => {
  const { limit, offset } = req.query;
  const { items, total } = await adminService.listVehiclesGlobal({ limit, offset });
  res.json({
    success: true,
    data: {
      items,
      meta: paginationMeta({ total, limit, offset }),
    },
  });
});

export const shipments = asyncHandler(async (req, res) => {
  const { limit, offset } = req.query;
  const { items, total } = await adminService.listShipmentsGlobal({ limit, offset });
  res.json({
    success: true,
    data: {
      items,
      meta: paginationMeta({ total, limit, offset }),
    },
  });
});

export const payments = asyncHandler(async (req, res) => {
  const { limit, offset } = req.query;
  const result = await adminService.listPaymentsGlobal({ limit, offset });
  const total = result.summary.totalRecords;
  res.json({
    success: true,
    data: {
      items: result.items,
      summary: result.summary,
      meta: paginationMeta({ total, limit, offset }),
    },
  });
});

export const stats = asyncHandler(async (req, res) => {
  const { days } = req.query;
  const data = await adminService.getStats({ days });
  res.json({ success: true, data: { ...data, periodDays: days } });
});

export const patchUser = asyncHandler(async (req, res) => {
  const user = await adminService.patchUserAccount(req.params.id, req.body);
  res.json({ success: true, data: user });
});
