const express = require("express");
const router = express.Router();
const ticketsController = require("../controllers/ticketsController");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const { validation, ticketSchema } = require("../middlewares/validation");

router.get("/", auth, ticketsController.getAllTickets);
router.get("/my", auth, ticketsController.getTicketsForUser);
router.get("/:id", auth, ticketsController.getTicketById);
router.post(
  "/",
  auth,
  validation(ticketSchema),
  ticketsController.createTicket,
);
router.put("/:id", auth, ticketsController.updateTicket);
router.patch("/:id/assign", auth, ticketsController.assignTicket);
router.patch("/:id/archive", auth, admin, ticketsController.archiveTicket);

module.exports = router;
