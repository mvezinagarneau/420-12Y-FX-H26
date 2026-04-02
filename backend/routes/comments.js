const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/commentsController");
const auth = require("../middlewares/auth");
const { validation, commentSchema } = require("../middlewares/validation");

router.get("/ticket/:ticketId", auth, commentsController.getCommentsForTicket);
router.post(
  "/ticket/:ticketId",
  auth,
  validation(commentSchema),
  commentsController.createComment,
);

module.exports = router;
