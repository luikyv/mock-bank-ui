import { useToast } from "vue-toastification";

const toast = useToast();

export enum ErrorCode {
  USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
}

export function handleError(err: unknown) {
  switch (true) {
    case err instanceof ErrorInfo:
      console.log(err.interactionId);
      switch (err.code) {
        case ErrorCode.USER_ALREADY_EXISTS:
          toast.error(
            `User already exists \nInteraction ID: ${err.interactionId}`
          );
          break;
        default:
          toast.error(`${err.message} \nInteraction ID: ${err.interactionId}`);
          break;
      }
      break;
    default:
      toast.error("Something went wrong :(");
      console.log(err);
  }
}

export class ErrorInfo extends Error {
  code: ErrorCode;
  interactionId?: string;
  constructor(code: ErrorCode, message: string, interactionId?: string) {
    super(message);
    this.code = code;
    this.interactionId = interactionId;
  }
}

export interface ResponseError extends Error {
  errors: {
    code: ErrorCode;
    detail: string;
  }[];
}
