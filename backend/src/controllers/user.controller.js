import * as userService from '../services/user.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const me = asyncHandler(async (req, res) => {
  const profile = await userService.getProfile(req.user.id);
  res.json(profile);
});

export const list = asyncHandler(async (req, res) => {
  const result = await userService.listUsersPaginated(req.query);
  res.json(result);
});
