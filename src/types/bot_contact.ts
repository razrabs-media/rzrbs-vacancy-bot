import { Model } from "sequelize";

export enum ChatType {
  channel = "channel",
  group = "group",
  private = "private",
  supergroup = "supergroup",
}

export interface IContact {
  chat_id: string;
  chat_title: string;
  chat_type: ChatType;
  removed: boolean;
}

// interface is not the same with IContact
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IContactCreationAttributes extends Omit<IContact, "removed"> {}

export interface IContactModel
  extends Model<IContact, IContactCreationAttributes>,
    IContact {}
