import { asyncHandler } from '../utils/asyncHandler.js';
import * as analyticsService from '../services/analytics.service.js';

export const impact = asyncHandler(async (_req, res) => {
  const data = await analyticsService.impactSummary();
  res.json(data);
});
