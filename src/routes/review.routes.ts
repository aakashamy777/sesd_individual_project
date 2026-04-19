import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { ReviewController } from "../controllers/review.controller";
import { ReviewService } from "../services/review.service";
import { ReviewRepository } from "../repositories/review.repository";

const router = Router();

const reviewRepository = new ReviewRepository();
const reviewService = new ReviewService(reviewRepository);
const reviewController = new ReviewController(reviewService);

router.post("/", authenticate, reviewController.createReview);

export default router;
