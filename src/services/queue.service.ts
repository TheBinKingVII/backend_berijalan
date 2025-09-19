import { PrismaClient } from "../generated/prisma";
import { IGlobalResponse } from "../interfaces/global.interface";

const prisma = new PrismaClient();

export const SGetAllQueues = async (): Promise<IGlobalResponse> => {
  const queues = await prisma.queue.findMany({
    select: {
      id: true,
      number: true,
      status: true,
      counterId: true,
      counterAt: {
        select: {
          id: true,
          name: true,
          isActive: true,
        },
      },
      ceratedAt: true,
      updatedAt: true,
    },
    orderBy: {
      ceratedAt: "desc",
    },
  });

  return {
    status: true,
    message: "Queues retrieved successfully",
    data: queues,
  };
};

export const SGetQueueById = async (id: string): Promise<IGlobalResponse> => {
  const queue = await prisma.queue.findFirst({
    where: {
      id: parseInt(id),
    },
    select: {
      id: true,
      number: true,
      status: true,
      counterId: true,
      counterAt: {
        select: {
          id: true,
          name: true,
          isActive: true,
        },
      },
      ceratedAt: true,
      updatedAt: true,
    },
  });

  if (!queue) {
    throw Error("Queue not found");
  }

  return {
    status: true,
    message: "Queue retrieved successfully",
    data: queue,
  };
};

export const ScreateQueue = async (
  number: number,
  status: string,
  counterId: number
): Promise<IGlobalResponse> => {
  // Check if counter exists and is active
  const counter = await prisma.counter.findFirst({
    where: {
      id: counterId,
      deletedAt: null,
    },
  });

  if (!counter) {
    throw Error("Counter not found or inactive");
  }

  const queue = await prisma.queue.create({
    data: {
      number,
      status,
      counterId,
    },
    select: {
      id: true,
      number: true,
      status: true,
      counterId: true,
      counterAt: {
        select: {
          id: true,
          name: true,
          isActive: true,
        },
      },
      ceratedAt: true,
      updatedAt: true,
    },
  });

  return {
    status: true,
    message: "Queue created successfully",
    data: queue,
  };
};

export const SupdateQueue = async (
  id: string,
  number?: number,
  status?: string,
  counterId?: number
): Promise<IGlobalResponse> => {
  const updateData: any = {};

  if (number !== undefined) updateData.number = number;
  if (status !== undefined) updateData.status = status;
  if (counterId !== undefined) {
    // Check if counter exists and is active
    const counter = await prisma.counter.findFirst({
      where: {
        id: counterId,
        deletedAt: null,
      },
    });

    if (!counter) {
      throw Error("Counter not found or inactive");
    }
    updateData.counterId = counterId;
  }

  const queue = await prisma.queue.update({
    where: { id: parseInt(id) },
    data: updateData,
    select: {
      id: true,
      number: true,
      status: true,
      counterId: true,
      counterAt: {
        select: {
          id: true,
          name: true,
          isActive: true,
        },
      },
      ceratedAt: true,
      updatedAt: true,
    },
  });

  return {
    status: true,
    message: "Queue updated successfully",
    data: queue,
  };
};

export const SupdateQueueStatus = async (
  id: string,
  status: "waiting" | "processing" | "completed" | "cancelled"
): Promise<IGlobalResponse> => {
  const validStatuses = ["waiting", "processing", "completed", "cancelled"];

  if (!validStatuses.includes(status)) {
    throw Error(
      "Invalid status. Must be 'waiting', 'processing', 'completed', or 'cancelled'"
    );
  }

  const queue = await prisma.queue.update({
    where: { id: parseInt(id) },
    data: { status },
    select: {
      id: true,
      number: true,
      status: true,
      counterId: true,
      counterAt: {
        select: {
          id: true,
          name: true,
          isActive: true,
        },
      },
      ceratedAt: true,
      updatedAt: true,
    },
  });

  return {
    status: true,
    message: `Queue status updated to ${status} successfully`,
    data: queue,
  };
};

export const SdeleteQueue = async (
  id: string
): Promise<IGlobalResponse<{ message: string }>> => {
  await prisma.queue.delete({
    where: { id: parseInt(id) },
  });

  return {
    status: true,
    message: "Queue deleted successfully",
  };
};

// New queue service methods
export const SclaimQueue = async (): Promise<IGlobalResponse> => {
  // Find the counter with the smallest current queue number
  const counter = await prisma.counter.findFirst({
    where: {
      isActive: true,
      deletedAt: null,
    },
    orderBy: {
      currenntQueue: "asc",
    },
  });

  if (!counter) {
    throw Error("No active counters available");
  }

  // Check if counter has reached max queue
  if (counter.currenntQueue >= counter.maxQueue) {
    throw Error("All counters are at maximum capacity");
  }

  // Generate next queue number for this counter
  const nextQueueNumber = counter.currenntQueue + 1;

  // Create new queue entry
  const queue = await prisma.queue.create({
    data: {
      number: nextQueueNumber,
      status: "waiting",
      counterId: counter.id,
    },
    select: {
      id: true,
      number: true,
      status: true,
      counterId: true,
      counterAt: {
        select: {
          id: true,
          name: true,
          isActive: true,
        },
      },
      ceratedAt: true,
    },
  });

  // Update counter's current queue number
  await prisma.counter.update({
    where: { id: counter.id },
    data: { currenntQueue: nextQueueNumber },
  });

  return {
    status: true,
    message: "Queue number claimed successfully",
    data: queue,
  };
};

export const SreleaseQueue = async (
  queueId: number
): Promise<IGlobalResponse> => {
  const queue = await prisma.queue.findFirst({
    where: {
      id: queueId,
      status: "waiting",
    },
  });

  if (!queue) {
    throw Error("Queue not found or already processed");
  }

  // Update queue status to released
  await prisma.queue.update({
    where: { id: queueId },
    data: { status: "released" },
  });

  return {
    status: true,
    message: "Queue released successfully",
    data: { queueId, status: "released" },
  };
};

export const SgetCurrentStatus = async (): Promise<IGlobalResponse> => {
  const counters = await prisma.counter.findMany({
    where: {
      isActive: true,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      currenntQueue: true,
      maxQueue: true,
      isActive: true,
      queue: {
        where: {
          status: "waiting",
        },
        select: {
          id: true,
          number: true,
          status: true,
        },
        orderBy: {
          number: "asc",
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return {
    status: true,
    message: "Current status retrieved successfully",
    data: counters,
  };
};

export const SnextQueue = async (
  counterId: string
): Promise<IGlobalResponse> => {
  const counter = await prisma.counter.findFirst({
    where: {
      id: parseInt(counterId),
      isActive: true,
      deletedAt: null,
    },
  });

  if (!counter) {
    throw Error("Counter not found or inactive");
  }

  // Find the oldest waiting queue for this counter
  const nextQueue = await prisma.queue.findFirst({
    where: {
      counterId: parseInt(counterId),
      status: "waiting",
    },
    orderBy: {
      number: "asc",
    },
    select: {
      id: true,
      number: true,
      status: true,
      counterId: true,
      counterAt: {
        select: {
          id: true,
          name: true,
          isActive: true,
        },
      },
      ceratedAt: true,
    },
  });

  if (!nextQueue) {
    throw Error("No waiting queue found for this counter");
  }

  // Update queue status to called
  const updatedQueue = await prisma.queue.update({
    where: { id: nextQueue.id },
    data: { status: "called" },
    select: {
      id: true,
      number: true,
      status: true,
      counterId: true,
      counterAt: {
        select: {
          id: true,
          name: true,
          isActive: true,
        },
      },
      ceratedAt: true,
    },
  });

  return {
    status: true,
    message: "Next customer called successfully",
    data: updatedQueue,
  };
};

export const SskipQueue = async (
  counterId: string
): Promise<IGlobalResponse> => {
  const counter = await prisma.counter.findFirst({
    where: {
      id: parseInt(counterId),
      isActive: true,
      deletedAt: null,
    },
  });

  if (!counter) {
    throw Error("Counter not found or inactive");
  }

  // Find the current called queue for this counter
  const currentQueue = await prisma.queue.findFirst({
    where: {
      counterId: parseInt(counterId),
      status: "called",
    },
    orderBy: {
      number: "asc",
    },
  });

  if (!currentQueue) {
    throw Error("No current queue to skip");
  }

  // Update current queue status to skipped
  await prisma.queue.update({
    where: { id: currentQueue.id },
    data: { status: "skipped" },
  });

  // Try to call the next customer
  const nextQueue = await prisma.queue.findFirst({
    where: {
      counterId: parseInt(counterId),
      status: "waiting",
    },
    orderBy: {
      number: "asc",
    },
    select: {
      id: true,
      number: true,
      status: true,
      counterId: true,
      counterAt: {
        select: {
          id: true,
          name: true,
          isActive: true,
        },
      },
      ceratedAt: true,
    },
  });

  let nextCalledQueue = null;
  if (nextQueue) {
    nextCalledQueue = await prisma.queue.update({
      where: { id: nextQueue.id },
      data: { status: "called" },
      select: {
        id: true,
        number: true,
        status: true,
        counterId: true,
        counterAt: {
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        },
        ceratedAt: true,
      },
    });
  }

  return {
    status: true,
    message: "Queue skipped successfully",
    data: {
      skippedQueue: {
        id: currentQueue.id,
        number: currentQueue.number,
        status: "skipped",
      },
      nextQueue: nextCalledQueue,
    },
  };
};

export const SresetQueue = async (
  counterId?: number
): Promise<IGlobalResponse> => {
  if (counterId) {
    // Reset specific counter
    const counter = await prisma.counter.findFirst({
      where: {
        id: counterId,
        isActive: true,
        deletedAt: null,
      },
    });

    if (!counter) {
      throw Error("Counter not found or inactive");
    }

    // Update all active queues for this counter to reset status
    await prisma.queue.updateMany({
      where: {
        counterId: counterId,
        status: {
          in: ["waiting", "called", "processing"],
        },
      },
      data: { status: "reset" },
    });

    // Reset counter's current queue to 0
    await prisma.counter.update({
      where: { id: counterId },
      data: { currenntQueue: 0 },
    });

    return {
      status: true,
      message: `Queue system reset for counter ${counter.name}`,
      data: { counterId, counterName: counter.name },
    };
  } else {
    // Reset all active counters
    const activeCounters = await prisma.counter.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
    });

    // Update all active queues to reset status
    await prisma.queue.updateMany({
      where: {
        status: {
          in: ["waiting", "called", "processing"],
        },
      },
      data: { status: "reset" },
    });

    // Reset all counters' current queue to 0
    await prisma.counter.updateMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      data: { currenntQueue: 0 },
    });

    return {
      status: true,
      message: "Queue system reset for all counters",
      data: {
        resetCounters: activeCounters.length,
        counterNames: activeCounters.map((c) => c.name),
      },
    };
  }
};
