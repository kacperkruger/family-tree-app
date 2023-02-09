import { isAxiosError } from "axios";

const parseErrorMessage = (e: unknown): string => {
  if (!isAxiosError(e)) return "Unknown error. Try again later.";
  if (!e.response || e.response.status >= 500)
    return "Unknown error. Try again later.";
  if (e.response.data.error) return e.response.data.error;
  return "Unknown error. Try again later.";
};

export default parseErrorMessage;
