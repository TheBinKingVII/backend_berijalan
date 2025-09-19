import { Request, Response, NextFunction } from "express";
import {
  ScreateCounter,
  SdeleteCounter,
  SGetAllCounters,
  SGetCounterById,
  SupdateCounter,
  SupdateCounterStatus,
} from "../services/counter.service";

export const CGetAllCounters = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await SGetAllCounters();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CGetCounterById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await SGetCounterById(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CcreateCounter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, maxQueue } = req.body;

    if (!name) {
      throw Error("Counter name is required");
    }

    const result = await ScreateCounter(name, maxQueue);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const CupdateCounter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, maxQueue } = req.body;

    if (!id) {
      throw Error("Counter ID is required");
    }

    const result = await SupdateCounter(id, name, maxQueue);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CupdateCounterStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      throw Error("Counter ID is required");
    }

    if (!status || !["active", "inactive", "disable"].includes(status)) {
      throw Error(
        "Status is required and must be 'active', 'inactive', or 'disable'"
      );
    }

    const result = await SupdateCounterStatus(id, status);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CdeleteCounter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      throw Error("Counter ID is required");
    }

    const result = await SdeleteCounter(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
