import { Configuration, OpenAIApi } from "openai";

import config from "../../utils/config";

const configuration = new Configuration({
  organization: config.aiOrganizationId,
  apiKey: config.aiApiKey,
});

const openai = new OpenAIApi(configuration);

export default openai;
