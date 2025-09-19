import { PrismaClient } from "../generated/prisma";
import { IGlobalResponse } from "../interfaces/global.interface";

const prisma = new PrismaClient();

export const SGetAllCounters = async (): Promise<IGlobalResponse> => {
  const counters = await prisma.counter.findMany({
    where: {
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      currenntQueue: true,
      maxQueue: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    status: true,
    message: "Counters retrieved successfully",
    data: counters,
  };
};

export const SGetCounterById = async (id: string): Promise<IGlobalResponse> => {
  const counter = await prisma.counter.findFirst({
    where: {
      id: parseInt(id),
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      currenntQueue: true,
      maxQueue: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!counter) {
    throw Error("Counter not found");
  }

  return {
    status: true,
    message: "Counter retrieved successfully",
    data: counter,
  };
};

export const ScreateCounter = async (
  name: string,
  maxQueue?: number
): Promise<IGlobalResponse> => {
  const counter = await prisma.counter.create({
    data: {
      name,
      maxQueue: maxQueue || 99,
    },
    select: {
      id: true,
      name: true,
      currenntQueue: true,
      maxQueue: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    status: true,
    message: "Counter created successfully",
    data: counter,
  };
};

export const SupdateCounter = async (
  id: string,
  name?: string,
  maxQueue?: number
): Promise<IGlobalResponse> => {
  const updateData: any = {};

  if (name !== undefined) updateData.name = name;
  if (maxQueue !== undefined) updateData.maxQueue = maxQueue;

  const counter = await prisma.counter.update({
    where: { id: parseInt(id) },
    data: updateData,
    select: {
      id: true,
      name: true,
      currenntQueue: true,
      maxQueue: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    status: true,
    message: "Counter updated successfully",
    data: counter,
  };
};

export const SupdateCounterStatus = async (
  id: string,
  status: "active" | "inactive" | "disable"
): Promise<IGlobalResponse> => {
  let updateData: any = {};

  switch (status) {
    case "active":
      updateData = { isActive: true, deletedAt: null };
      break;
    case "inactive":
      updateData = { isActive: false, deletedAt: null };
      break;
    case "disable":
      updateData = { deletedAt: new Date() };
      break;
    default:
      throw Error("Invalid status. Must be 'active', 'inactive', or 'disable'");
  }

  const counter = await prisma.counter.update({
    where: { id: parseInt(id) },
    data: updateData,
    select: {
      id: true,
      name: true,
      currenntQueue: true,
      maxQueue: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    status: true,
    message: `Counter status updated to ${status} successfully`,
    data: counter,
  };
};

export const SdeleteCounter = async (
  id: string
): Promise<IGlobalResponse<{ message: string }>> => {
  await prisma.counter.delete({
    where: { id: parseInt(id) },
  });

  return {
    status: true,
    message: "Counter deleted successfully",
  };
};
