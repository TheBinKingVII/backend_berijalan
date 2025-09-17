import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcrypt";
import { IAdminResponse, IGlobalResponse } from "../interfaces/global.interface";
import { ILoginResponse } from "../interfaces/global.interface";

const prisma = new PrismaClient();

export const Slogin = async (usernameOrEmail: string, password: string): Promise<IGlobalResponse<ILoginResponse>> => {
  const admin = await prisma.admin.findFirst({
    where: {
      OR: [
        {
          username: usernameOrEmail,
        },
        {
          email: usernameOrEmail,
        },
      ],
      isActive: true,
      deletedAt: null,
    },
  });

  if (!admin) {
    throw Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password);

  if (!isPasswordValid) {
    throw Error("Invalid credentials");
  }

  //   const token = UGenerateToken({
  //     id: admin.id,
  //     username: usernameOrEmail,
  //     email: admin.email,
  //     name: admin.name,
  //   });

  return {
    status: true,
    message: "Login successfull",
    data: {
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
      },
    },
  };
};

export const ScreateAdmin = async (username: string, password: string, email: string, name: string): Promise<IGlobalResponse<IAdminResponse>> => {
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.create({
    data: {
      username,
      password: passwordHash,
      email,
      name,
    },
  });

  return {
    status: true,
    message: "Admin created",
    data: { id: admin.id, username: admin.username, email: admin.email, name: admin.name },
  };
};

export const SupdateAdmin = async (id: string, username: string, password: string, email: string, name: string): Promise<IGlobalResponse<IAdminResponse>> => {
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.update({
    where: { id: parseInt(id) },
    data: { username, password: passwordHash, email, name },
  });

  return {
    status: true,
    message: "Admin updated",
    data: { id: admin.id, username: admin.username, email: admin.email, name: admin.name },
  };
};

export const SdeleteAdmin = async (id: string): Promise<IGlobalResponse<{ message: string }>> => {
  await prisma.admin.delete({
    where: { id: parseInt(id) },
  });

  return {
    status: true,
    message: "Admin deleted",
  };
};
