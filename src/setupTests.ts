import dotenv from "dotenv";

dotenv.config({ path: ".env.testing" });

jest.mock("sequelize", () => {
  const mSequelize = {
    authenticate: jest.fn().mockResolvedValue({}),
    define: jest.fn().mockResolvedValue({}),
  };
  const actualSequelize = jest.requireActual("sequelize");
  return {
    Sequelize: jest.fn(() => mSequelize),
    DataTypes: actualSequelize.DataTypes,
  };
});

jest.mock("./connectToDatabase", () => ({
  authenticate: jest.fn().mockResolvedValue({}),
  define: jest.fn().mockResolvedValue({}),
}));
