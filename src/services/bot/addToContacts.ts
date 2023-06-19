import ContactModel from "../../schemas/contact";
import { ChatType } from "../../types/bot_contact";
import logger from "../logger";

interface IAddToContactsParams {
  id: string;
  title: string;
  type: ChatType;
}

export const addToContacts = async ({
  id,
  title,
  type,
}: IAddToContactsParams) => {
  try {
    logger.info(`Adding ${title}::${type}::${id} to Bot contacts...`);

    const itemInContacts = await ContactModel.findOne({
      where: {
        chat_id: id,
      },
    });

    if (itemInContacts) {
      throw Error("contact already exists");
    }

    await ContactModel.create({
      chat_id: id,
      chat_title: title,
      chat_type: type,
    });

    logger.info(`Success: added ${title}::${type}::${id} to Bot contacts`);
  } catch (err) {
    logger.error(
      `Failed: adding ${title}::${type}::${id} to Bot contacts - ${err}`
    );
  }
};
