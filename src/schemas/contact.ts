import { DataTypes } from "sequelize";
import db from "../connectToDatabase";
import { IContactModel } from "../types/bot_contact";

/* Contact to publish vacancies to */
export const ContactModel = db.define<IContactModel>(
  "Contact",
  {
    chat_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
      primaryKey: true,
    },
    chat_title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    chat_type: {
      type: DataTypes.ENUM("channel", "group"),
      allowNull: false,
      validate: { notEmpty: true },
    },
    removed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      validate: { notEmpty: true },
    },
  },
  {
    timestamps: true,
    indexes: [{ unique: true, fields: ["chat_id"] }],
  }
);

export default ContactModel;
