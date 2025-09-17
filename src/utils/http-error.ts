import { IErrorDetail } from "../interfaces/global.interface";

export class HttpError extends Error {
  statusCode: number;
  details?: IErrorDetail | IErrorDetail[];

  constructor(statusCode: number, message: string, details?: IErrorDetail | IErrorDetail[]) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.details = details;
  }
}
