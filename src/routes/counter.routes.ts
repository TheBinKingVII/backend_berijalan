import { Router } from "express";
import Joi from "joi";
import {
  CcreateCounter,
  CdeleteCounter,
  CGetAllCounters,
  CGetCounterById,
  CupdateCounter,
  CupdateCounterStatus,
} from "../controllers/counter.controller";
import { MValidate } from "../middlewares/validate.middleware";
import { MAuthenticate } from "../middlewares/auth.middleware";

const router = Router();

const createCounterSchema = Joi.object({
  name: Joi.string().max(100).required(),
  maxQueue: Joi.number().integer().min(1).max(999).optional(),
});

const updateCounterSchema = Joi.object({
  name: Joi.string().max(100).optional(),
  maxQueue: Joi.number().integer().min(1).max(999).optional(),
});

const updateCounterStatusSchema = Joi.object({
  status: Joi.string().valid("active", "inactive", "disable").required(),
});

// GET /api/v1/counter - Get all counters
router.get("/", CGetAllCounters);

// GET /api/v1/counter/:id - Get single counter detail
router.get("/:id", CGetCounterById);

// POST /api/v1/counter - Create counter
router.post("/", MAuthenticate, MValidate(createCounterSchema), CcreateCounter);

// PUT /api/v1/counter/:id - Update counter
router.put(
  "/:id",
  MAuthenticate,
  MValidate(updateCounterSchema),
  CupdateCounter
);

// PATCH /api/v1/counter/:id/status - Update counter status
router.patch(
  "/:id/status",
  MAuthenticate,
  MValidate(updateCounterStatusSchema),
  CupdateCounterStatus
);

// DELETE /api/v1/counter/:id - Delete counter
router.delete("/:id", MAuthenticate, CdeleteCounter);

export default router;
