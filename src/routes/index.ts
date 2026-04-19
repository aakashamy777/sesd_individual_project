import { Router } from "express";
import healthRoutes from "./health.routes";
import authRoutes from "./auth.routes";
import hotelRoutes from "./hotel.routes";
import roomRoutes from "./room.routes";
import bookingRoutes from "./booking.routes";
import reviewRoutes from "./review.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/hotels", hotelRoutes);
router.use("/rooms", roomRoutes);
router.use("/bookings", bookingRoutes);
router.use("/reviews", reviewRoutes);

export default router;
