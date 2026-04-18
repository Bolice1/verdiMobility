import * as companyService from '../services/company.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const create = asyncHandler(async (req, res) => {
  const company = await companyService.createCompany(req.user, req.body);
  res.status(201).json(company);
});
