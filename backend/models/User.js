const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50],
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 50],
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 255],
        isStrong(value) {
          const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$ %^&*\-]).*$/;
          if (!regex.test(value)) {
            throw new Error(
              "Password must contain at least one lowercase, one uppercase, one number, and one special character.",
            );
          }
        },
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isCanadianPhone(value) {
          const regex = /^\(\d{3}\) \d{3}-\d{4}$/;
          if (!regex.test(value)) {
            throw new Error("Invalid phone format.");
          }
        },
      },
    },
    role: {
      type: DataTypes.ENUM("client", "technicien", "admin"),
      allowNull: false,
      defaultValue: "client",
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  },
);

module.exports = User;
