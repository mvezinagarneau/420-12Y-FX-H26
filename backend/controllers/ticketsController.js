const Ticket = require("../models/Ticket");
const Category = require("../models/Category");
const User = require("../models/User");
const Comment = require("../models/Comment");
const { Op } = require("sequelize");

exports.getAllTickets = async (req, res, next) => {
  try {
    const {
      status,
      categoryId,
      technicianId,
      search,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = req.query;
    const where = { archived: false };

    // Role-based filtering
    if (req.user.role === "client") {
      where.userId = req.user.id;
    } else if (req.user.role === "technicien") {
      where.technicianId = req.user.id;
    }
    // Admin sees all

    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;
    if (technicianId) where.technicianId = technicianId;
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const tickets = await Ticket.findAll({
      where,
      include: [
        {
          model: User,
          as: "client",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: User,
          as: "technician",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        { model: Category, as: "category", attributes: ["id", "name"] },
      ],
      order: [[sortBy, sortOrder]],
    });
    res.json({
      status: 200,
      message: "Tickets récupérés avec succès.",
      data: tickets,
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

exports.getTicketsForUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status, sortBy = "createdAt", sortOrder = "DESC" } = req.query;
    const where = { archived: false };
    if (req.user.role === "client") {
      where.clientId = userId;
    } else {
      // technician or admin
      where.technicianId = userId;
    }
    if (status) where.status = status;

    const tickets = await Ticket.findAll({
      where,
      include: [
        {
          model: User,
          as: "client",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: User,
          as: "technician",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        { model: Category, as: "category", attributes: ["id", "name"] },
      ],
      order: [[sortBy, sortOrder]],
    });
    res.json({
      status: 200,
      message: "Tickets récupérés avec succès.",
      data: tickets,
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

exports.getTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id, {
      include: [
        {
          model: User,
          as: "client",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: User,
          as: "technician",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        { model: Category, as: "category", attributes: ["id", "name"] },
        {
          model: Comment,
          as: "comments",
          include: [
            {
              model: User,
              as: "author",
              attributes: ["id", "firstName", "lastName", "role"],
            },
          ],
          order: [["createdAt", "ASC"]],
        },
      ],
    });
    if (!ticket) {
      return res.status(404).json({
        status: 404,
        error: "Not Found",
        message: "Ticket non trouvé.",
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }
    res.json({
      status: 200,
      message: "Ticket récupéré avec succès.",
      data: ticket,
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

exports.createTicket = async (req, res, next) => {
  try {
    const { title, description, priority, categoryId } = req.body;
    const clientId = req.user.id;
    const ticket = await Ticket.create({
      title,
      description,
      priority,
      categoryId,
      clientId,
    });
    const ticketWithIncludes = await Ticket.findByPk(ticket.id, {
      include: [
        {
          model: User,
          as: "client",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        { model: Category, as: "category", attributes: ["id", "name"] },
      ],
    });
    res.status(201).json({
      status: 201,
      message: "Ticket créé avec succès.",
      data: ticketWithIncludes,
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { technicianId, status } = req.body;
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({
        status: 404,
        error: "Not Found",
        message: "Ticket non trouvé.",
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }
    if (ticket.archived) {
      return res.status(400).json({
        status: 400,
        error: "Bad Request",
        message: "Impossible de modifier un ticket archivé.",
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }
    // Check permissions and transitions
    const updateData = {};
    if (technicianId !== undefined) {
      if (req.user.role !== "admin") {
        return res.status(403).json({
          status: 403,
          error: "Forbidden",
          message: "Seul l'administrateur peut assigner un ticket.",
          path: req.path,
          timestamp: new Date().toISOString(),
        });
      }
      updateData.technicianId = technicianId;
      if (!ticket.technicianId && technicianId) {
        updateData.status = "Assigné";
      }
    }
    if (status) {
      // Validate transition
      const allowedTransitions = {
        Ouvert: ["Assigné"],
        Assigné: ["En cours"],
        "En cours": ["En attente", "Résolu"],
        "En attente": ["En cours"],
        Résolu: ["Fermé"],
        Fermé: ["Archivé"],
      };
      if (!allowedTransitions[ticket.status]?.includes(status)) {
        return res.status(400).json({
          status: 400,
          error: "Bad Request",
          message: `Transition de ${ticket.status} vers ${status} non autorisée.`,
          path: req.path,
          timestamp: new Date().toISOString(),
        });
      }
      if (
        status === "Fermé" &&
        req.user.role === "technicien" &&
        req.user.id !== ticket.technicianId
      ) {
        return res.status(403).json({
          status: 403,
          error: "Forbidden",
          message: "Seul le client ou l'administrateur peut fermer un ticket.",
          path: req.path,
          timestamp: new Date().toISOString(),
        });
      }
      if (status === "Archivé" && req.user.role !== "admin") {
        return res.status(403).json({
          status: 403,
          error: "Forbidden",
          message: "Seul l'administrateur peut archiver un ticket.",
          path: req.path,
          timestamp: new Date().toISOString(),
        });
      }
      updateData.status = status;
    }
    await ticket.update(updateData);
    res.json({
      status: 200,
      message: "Ticket mis à jour avec succès.",
      data: ticket,
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

exports.assignTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({
        status: 404,
        error: "Not Found",
        message: "Ticket non trouvé.",
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }
    if (ticket.technicianId) {
      return res.status(400).json({
        status: 400,
        error: "Bad Request",
        message: "Ticket déjà assigné.",
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }
    await ticket.update({ technicianId: req.user.id, status: "Assigné" });
    res.json({
      status: 200,
      message: "Ticket assigné avec succès.",
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

exports.archiveTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({
        status: 404,
        error: "Not Found",
        message: "Ticket non trouvé.",
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }
    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: 403,
        error: "Forbidden",
        message: "Seul l'administrateur peut archiver un ticket.",
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }
    await ticket.update({ archived: true });
    res.json({
      status: 200,
      message: "Ticket archivé avec succès.",
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};
