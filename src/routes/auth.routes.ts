import { Router } from "express";
import Joi from "joi";
import { CcreateAdmin, CdeleteAdmin, Clogin, CupdateAdmin } from "../controllers/auth.controller";
import { MValidate } from "../middlewares/validate.middleware";

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

router.post("/login", Clogin);
router.post("/create", MValidate(createAdminSchema), CcreateAdmin);
router.put("/:id", MValidate(updateAdminSchema), CupdateAdmin);
router.delete("/:id", CdeleteAdmin);

export default router;
