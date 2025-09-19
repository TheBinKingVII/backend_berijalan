import { Request, Response, NextFunction } from "express";
import {
  ScreateQueue,
  SdeleteQueue,
  SGetAllQueues,
  SGetQueueById,
  SupdateQueue,
  SupdateQueueStatus,
  SclaimQueue,
  SreleaseQueue,
  SgetCurrentStatus,
  SnextQueue,
  SskipQueue,
  SresetQueue,
} from "../services/queue.service";

export const CGetAllQueues = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await SGetAllQueues();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CGetQueueById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await SGetQueueById(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CcreateQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { number, status, counterId } = req.body;

    if (!number || !status || !counterId) {
      throw Error("Number, status, and counterId are required");
    }

    const result = await ScreateQueue(number, status, counterId);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const CupdateQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { number, status, counterId } = req.body;

    if (!id) {
      throw Error("Queue ID is required");
    }

    const result = await SupdateQueue(id, number, status, counterId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CupdateQueueStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      throw Error("Queue ID is required");
    }

    if (
      !status ||
      !["waiting", "processing", "completed", "cancelled"].includes(status)
    ) {
      throw Error(
        "Status is required and must be 'waiting', 'processing', 'completed', or 'cancelled'"
      );
    }

    const result = await SupdateQueueStatus(id, status);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CdeleteQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      throw Error("Queue ID is required");
    }

    const result = await SdeleteQueue(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// New queue endpoints
export const CclaimQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await SclaimQueue();
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const CreleaseQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { queueId } = req.body;
    const result = await SreleaseQueue(queueId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CgetCurrentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await SgetCurrentStatus();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CnextQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { counter_id } = req.params;
    const result = await SnextQueue(counter_id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CskipQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { counter_id } = req.params;
    const result = await SskipQueue(counter_id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CresetQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { counterId } = req.body;
    const result = await SresetQueue(counterId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
