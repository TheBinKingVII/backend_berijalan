import { Request, Response, NextFunction } from "express";
import {
  ScreateAdmin,
  SdeleteAdmin,
  SGetAllAdmins,
  SGetAdminById,
  Slogin,
  SupdateAdmin,
} from "../services/auth.service";

export const Clogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body;
    const result = await Slogin(username, password);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CcreateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password, email, name } = req.body;
    const result = await ScreateAdmin(username, password, email, name);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CupdateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { username, password, email, name } = req.body;
    const result = await SupdateAdmin(id, username, password, email, name);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CdeleteAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await SdeleteAdmin(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CGetAllAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await SGetAllAdmins();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CGetAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await SGetAdminById(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
