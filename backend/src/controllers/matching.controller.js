import * as matchingService from '../services/matching.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const run = asyncHandler(async (req, res) => {
  const result = await matchingService.runMatching(req.body, req.user);
  res.json(result);
});
