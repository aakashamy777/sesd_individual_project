import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/authorize-admin.middleware";
import { RoomController } from "../controllers/room.controller";
import { RoomService } from "../services/room.service";
import { RoomRepository } from "../repositories/room.repository";

const router = Router();

const roomRepository = new RoomRepository();
const roomService = new RoomService(roomRepository);
const roomController = new RoomController(roomService);

router.use(authenticate);

router.post("/", requireAdmin, roomController.createRoom);
router.get("/", roomController.getRooms);
router.get("/available", roomController.getAvailableRooms);
router.get("/:id", roomController.getRoomById);
router.put("/:id", requireAdmin, roomController.updateRoom);
router.delete("/:id", requireAdmin, roomController.deleteRoom);

export default router;
