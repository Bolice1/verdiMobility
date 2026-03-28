import * as ratingService from '../services/rating.service.js';

export async function createRating(req, res, next) {
  try {
    const result = await ratingService.createRating(req.user, req.body);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
}

export async function listDriverRatings(req, res, next) {
  try {
    const { driverId } = req.params;
    const data = await ratingService.listRatingsForDriver(driverId, req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
