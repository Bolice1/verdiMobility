import { Router } from 'express';

import authRoutes from './auth.routes.js';
import companyRoutes from './company.routes.js';
import matchingRoutes from './matching.routes.js';
import shipmentRoutes from './shipment.routes.js';
import userRoutes from './user.routes.js';
import vehicleRoutes from './vehicle.routes.js';
import ratingRoutes from './rating.routes.js';
import analyticsRoutes from './analytics.routes.js';

const api = Router();

api.use('/auth', authRoutes);
api.use('/users', userRoutes);
api.use('/shipments', shipmentRoutes);
api.use('/companies', companyRoutes);
api.use('/vehicles', vehicleRoutes);
api.use('/matching', matchingRoutes);
api.use('/ratings', ratingRoutes);
api.use('/analytics', analyticsRoutes);

export default api;
