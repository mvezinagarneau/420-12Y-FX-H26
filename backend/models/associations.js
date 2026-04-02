const User = require("./User");
const Category = require("./Category");
const Ticket = require("./Ticket");
const Comment = require("./Comment");

// User associations
User.hasMany(Ticket, { foreignKey: "clientId", as: "clientTickets" });
User.hasMany(Ticket, { foreignKey: "technicianId", as: "technicianTickets" });
User.hasMany(Comment, { foreignKey: "userId", as: "comments" });

// Category associations
Category.hasMany(Ticket, { foreignKey: "categoryId", as: "tickets" });

// Ticket associations
Ticket.belongsTo(User, { foreignKey: "clientId", as: "client" });
Ticket.belongsTo(User, { foreignKey: "technicianId", as: "technician" });
Ticket.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Ticket.hasMany(Comment, { foreignKey: "ticketId", as: "comments" });

// Comment associations
Comment.belongsTo(Ticket, { foreignKey: "ticketId", as: "ticket" });
Comment.belongsTo(User, { foreignKey: "userId", as: "author" });

module.exports = {
  User,
  Category,
  Ticket,
  Comment,
};
