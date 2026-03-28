import { Router } from 'express';

import authRoutes from './auth.routes.js';
import companyRoutes from './company.routes.js';
import matchingRoutes from './matching.routes.js';
import shipmentRoutes from './shipment.routes.js';
import userRoutes from './user.routes.js';
import vehicleRoutes from './vehicle.routes.js';

const api = Router();

api.use('/auth', authRoutes);
api.use('/users', userRoutes);
api.use('/shipments', shipmentRoutes);
api.use('/companies', companyRoutes);
api.use('/vehicles', vehicleRoutes);
api.use('/matching', matchingRoutes);

export default api;
