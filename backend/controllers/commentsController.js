const Comment = require("../models/Comment");
const Ticket = require("../models/Ticket");

exports.getCommentsForTicket = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) {
      return res.status(404).json({
        status: 404,
        error: "Not Found",
        message: "Ticket non trouvé.",
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }
    const comments = await Comment.findAll({
      where: { ticketId },
      include: [
        {
          model: require("../models/User"),
          as: "author",
          attributes: ["id", "firstName", "lastName", "role"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });
    res.json({
      status: 200,
      message: "Commentaires récupérés avec succès.",
      data: comments,
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

exports.createComment = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { content, type = "public" } = req.body;
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) {
      return res.status(404).json({
        status: 404,
        error: "Not Found",
        message: "Ticket non trouvé.",
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }
    if (ticket.status === "Fermé" || ticket.archived) {
      return res.status(400).json({
        status: 400,
        error: "Bad Request",
        message:
          "Impossible d'ajouter un commentaire à un ticket fermé ou archivé.",
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }
    // Check permissions
    const userId = req.user.id;
    const isClient = req.user.role === "client";
    const isTechnician = req.user.role === "technicien";
    const isAdmin = req.user.role === "admin";
    const isAssignedTechnician = ticket.technicianId === userId;
    const isTicketClient = ticket.clientId === userId;

    if (isClient && !isTicketClient) {
      return res.status(403).json({
        status: 403,
        error: "Forbidden",
        message: "Vous ne pouvez commenter que vos propres tickets.",
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }
    if (isTechnician && !isAssignedTechnician && !isAdmin) {
      return res.status(403).json({
        status: 403,
        error: "Forbidden",
        message:
          "Vous ne pouvez commenter que les tickets qui vous sont assignés.",
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }
    if (type === "internal" && isClient) {
      return res.status(400).json({
        status: 400,
        error: "Bad Request",
        message: "Les commentaires des clients sont toujours publics.",
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }

    const comment = await Comment.create({
      content,
      type,
      ticketId,
      userId,
    });
    const commentWithAuthor = await Comment.findByPk(comment.id, {
      include: [
        {
          model: require("../models/User"),
          as: "author",
          attributes: ["id", "firstName", "lastName", "role"],
        },
      ],
    });
    res.status(201).json({
      status: 201,
      message: "Commentaire ajouté avec succès.",
      data: commentWithAuthor,
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};
