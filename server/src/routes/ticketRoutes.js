import express from "express";

import {
  createTicket,
  getProjectTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} from "../controllers/ticketController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createTicket);
router.route("/project/:projectId").get(getProjectTickets);

router
  .route("/:id")
  .get(getTicketById)
  .patch(updateTicket)
  .delete(deleteTicket);

export default router;
