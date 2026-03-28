import { asyncHandler } from '../utils/asyncHandler.js';
import * as analyticsService from '../services/analytics.service.js';

export const impact = asyncHandler(async (req, res) => {
  const data = await analyticsService.impactSummary(req.user);
  res.json(data);
});
