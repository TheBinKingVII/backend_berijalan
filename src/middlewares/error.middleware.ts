import { NextFunction, Request, Response } from "express";
import { IGlobalResponse } from "../interfaces/global.interface";
import { HttpError } from "../utils/http-error";

export const MErrorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error("Error:", err);

  const isDevelopment = process.env.NODE_ENV === "development";

  if (err instanceof HttpError) {
    const response: IGlobalResponse = {
      status: false,
      message: err.message,
      ...(err.details && { error: Array.isArray(err.details) ? err.details : [err.details] }),
    };

    res.status(err.statusCode).json(response);
    return;
  }

  if (err instanceof Error) {
    const response: IGlobalResponse = {
      status: false,
      message: err.message,
    };

    const errorObj: any = {
      message: err.message,
    };

    if (err.name) {
      errorObj.name = err.name;
    }

    if (isDevelopment && err.stack) {
      errorObj.detail = err.stack;
    }

    response.error = errorObj;

    res.status(400).json(response);
  } else {
    const response: IGlobalResponse = {
      status: false,
      message: "An unexpected error occured",
      error: {
        message: "Internal server error",
        ...(isDevelopment && {
          detail: err.stack,
        }),
      },
    };

    res.status(500).json(response);
  }
};
