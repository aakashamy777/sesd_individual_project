import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/authorize-admin.middleware";
import { HotelController } from "../controllers/hotel.controller";
import { HotelService } from "../services/hotel.service";
import { HotelRepository } from "../repositories/hotel.repository";
import { ReviewController } from "../controllers/review.controller";
import { ReviewService } from "../services/review.service";
import { ReviewRepository } from "../repositories/review.repository";

const router = Router();

const hotelRepository = new HotelRepository();
const hotelService = new HotelService(hotelRepository);
const hotelController = new HotelController(hotelService);
const reviewRepository = new ReviewRepository();
const reviewService = new ReviewService(reviewRepository);
const reviewController = new ReviewController(reviewService);

router.use(authenticate);

router.post("/", requireAdmin, hotelController.createHotel);
router.get("/", hotelController.getHotels);
router.get("/:id", hotelController.getHotelById);
router.get("/:hotelId/reviews", reviewController.getHotelReviews);
router.put("/:id", requireAdmin, hotelController.updateHotel);
router.delete("/:id", requireAdmin, hotelController.deleteHotel);

export default router;
