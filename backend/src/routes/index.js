import { Router } from 'express';

import adminRoutes from './admin.routes.js';
import authRoutes from './auth.routes.js';
import companyRoutes from './company.routes.js';
import matchingRoutes from './matching.routes.js';
import shipmentRoutes from './shipment.routes.js';
import userRoutes from './user.routes.js';
import vehicleRoutes from './vehicle.routes.js';
import ratingRoutes from './rating.routes.js';
import analyticsRoutes from './analytics.routes.js';
import paymentRoutes from './payment.routes.js';
import marketplaceRoutes from './marketplace.routes.js';

const api = Router();

api.use('/auth', authRoutes);
api.use('/admin', adminRoutes);
api.use('/users', userRoutes);
api.use('/shipments', shipmentRoutes);
api.use('/companies', companyRoutes);
api.use('/vehicles', vehicleRoutes);
api.use('/matching', matchingRoutes);
api.use('/ratings', ratingRoutes);
api.use('/analytics', analyticsRoutes);
api.use('/payments', paymentRoutes);
api.use('/marketplace', marketplaceRoutes);

export default api;
