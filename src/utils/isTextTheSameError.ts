import { TEXT_THE_SAME_ERROR_MESSAGE } from "../constants/errors";

export const isTextTheSameError = (error: unknown): boolean =>
  Boolean((error as Error)?.message?.includes(TEXT_THE_SAME_ERROR_MESSAGE));
