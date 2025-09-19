import { Router } from "express";
import Joi from "joi";
import {
  CcreateQueue,
  CdeleteQueue,
  CGetAllQueues,
  CGetQueueById,
  CupdateQueue,
  CupdateQueueStatus,
  CclaimQueue,
  CreleaseQueue,
  CgetCurrentStatus,
  CnextQueue,
  CskipQueue,
  CresetQueue,
} from "../controllers/queue.controller";
import { MValidate } from "../middlewares/validate.middleware";
import { MAuthenticate } from "../middlewares/auth.middleware";

const router = Router();

const createQueueSchema = Joi.object({
  number: Joi.number().integer().min(1).required(),
  status: Joi.string()
    .valid("waiting", "processing", "completed", "cancelled")
    .required(),
  counterId: Joi.number().integer().min(1).required(),
});

const updateQueueSchema = Joi.object({
  number: Joi.number().integer().min(1).optional(),
  status: Joi.string()
    .valid("waiting", "processing", "completed", "cancelled")
    .optional(),
  counterId: Joi.number().integer().min(1).optional(),
});

const updateQueueStatusSchema = Joi.object({
  status: Joi.string()
    .valid("waiting", "processing", "completed", "cancelled")
    .required(),
});

const releaseQueueSchema = Joi.object({
  queueId: Joi.number().integer().min(1).required(),
});

const resetQueueSchema = Joi.object({
  counterId: Joi.number().integer().min(1).optional(),
});

// Public queue endpoints
// GET /api/v1/queue/current - Get current status of all active counters
router.get("/current", CgetCurrentStatus);

// POST /api/v1/queue/claim - Claim a queue number
router.post("/claim", CclaimQueue);

// POST /api/v1/queue/release - Release a queue
router.post("/release", MValidate(releaseQueueSchema), CreleaseQueue);

// Protected queue endpoints
// GET /api/v1/queue - Get all queues
router.get("/", MAuthenticate, CGetAllQueues);

// GET /api/v1/queue/:id - Get single queue detail
router.get("/:id", MAuthenticate, CGetQueueById);

// POST /api/v1/queue - Create queue
router.post("/", MAuthenticate, MValidate(createQueueSchema), CcreateQueue);

// PUT /api/v1/queue/:id - Update queue
router.put("/:id", MAuthenticate, MValidate(updateQueueSchema), CupdateQueue);

// PATCH /api/v1/queue/:id/status - Update queue status
router.patch(
  "/:id/status",
  MAuthenticate,
  MValidate(updateQueueStatusSchema),
  CupdateQueueStatus
);

// DELETE /api/v1/queue/:id - Delete queue
router.delete("/:id", MAuthenticate, CdeleteQueue);

// POST /api/v1/queue/next/:counter_id - Call next customer
router.post("/next/:counter_id", MAuthenticate, CnextQueue);

// POST /api/v1/queue/skip/:counter_id - Skip current queue
router.post("/skip/:counter_id", MAuthenticate, CskipQueue);

// POST /api/v1/queue/reset - Reset queue system
router.post("/reset", MAuthenticate, MValidate(resetQueueSchema), CresetQueue);

export default router;
