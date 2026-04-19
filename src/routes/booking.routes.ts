import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/authorize-admin.middleware";
import { BookingController } from "../controllers/booking.controller";
import { BookingService } from "../services/booking.service";
import { BookingRepository } from "../repositories/booking.repository";

const router = Router();

const bookingRepository = new BookingRepository();
const bookingService = new BookingService(bookingRepository);
const bookingController = new BookingController(bookingService);

router.use(authenticate);

router.post("/", bookingController.createBooking);
router.get("/me", bookingController.getUserBookings);
router.get("/", requireAdmin, bookingController.getAllBookings);
router.patch("/:id/cancel", bookingController.cancelBooking);

export default router;
