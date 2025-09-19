import { Router } from "express";
import Joi from "joi";
import {
  CcreateAdmin,
  CdeleteAdmin,
  Clogin,
  CupdateAdmin,
  CGetAllAdmins,
  CGetAdminById,
} from "../controllers/auth.controller";
import { MValidate } from "../middlewares/validate.middleware";
import { MAuthenticate } from "../middlewares/auth.middleware";

const router = Router();

const createAdminSchema = Joi.object({
  username: Joi.string().max(50).required(),
  password: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
  name: Joi.string().required(),
});

const updateAdminSchema = Joi.object({
  username: Joi.string().max(50).optional(),
  password: Joi.string().min(8).optional(),
  email: Joi.string().email().optional(),
  name: Joi.string().optional(),
});

// Public routes
router.post("/login", Clogin);

// Protected routes
router.get("/", MAuthenticate, CGetAllAdmins);
router.get("/:id", MAuthenticate, CGetAdminById);
router.post(
  "/create",
  MAuthenticate,
  MValidate(createAdminSchema),
  CcreateAdmin
);
router.put("/:id", MAuthenticate, MValidate(updateAdminSchema), CupdateAdmin);
router.delete("/:id", MAuthenticate, CdeleteAdmin);

export default router;
