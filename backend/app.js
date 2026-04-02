const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/database");
const userRoutes = require("./routes/users");
const dbRoutes = require("./routes/db");
const categoriesRoutes = require("./routes/categories");
const ticketsRoutes = require("./routes/tickets");
const commentsRoutes = require("./routes/comments");
const errorHandler = require("./middlewares/errorHandler");
require("./models/associations"); // Load associations

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/users", userRoutes);
app.use("/db", dbRoutes);
app.use("/categories", categoriesRoutes);
app.use("/tickets", ticketsRoutes);
app.use("/comments", commentsRoutes);
// Error handling middleware
app.use(errorHandler);

// Sync database
sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Database synced");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
