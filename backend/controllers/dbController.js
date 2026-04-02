const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.seed = async (req, res, next) => {
  try {
    await User.bulkCreate(
      [
        {
          lastName: "ClientA",
          firstName: "UserA",
          email: "a@asp.ca",
          password: await bcrypt.hash("Password123!", 10),
          phone: "(111) 111-1111",
          role: "client",
          active: true,
        },
        {
          lastName: "ClientB",
          firstName: "UserB",
          email: "b@asp.ca",
          password: await bcrypt.hash("Password123!", 10),
          phone: "(222) 222-2222",
          role: "client",
          active: true,
        },
        {
          lastName: "Tech1",
          firstName: "User",
          email: "tech1@asp.ca",
          password: await bcrypt.hash("Password123!", 10),
          phone: "(333) 333-3333",
          role: "technicien",
          active: true,
        },
        {
          lastName: "Tech2",
          firstName: "User",
          email: "tech2@asp.ca",
          password: await bcrypt.hash("Password123!", 10),
          phone: "(444) 444-4444",
          role: "technicien",
          active: true,
        },
        {
          lastName: "Admin",
          firstName: "Super",
          email: "admin@asp.ca",
          password: await bcrypt.hash("Password123!", 10),
          phone: "(000) 000-0000",
          role: "admin",
          active: true,
        },
      ],
      { ignoreDuplicates: true },
    );
    res.json({ message: "Database seeded successfully" });
  } catch (error) {
    next(error);
  }
};
