import { PrismaClient, Prisma } from '@prisma/client';
import UserDTO from '../dtos/userDTO';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();


export class UserModel {

  async createUser(data: UserDTO) {
    try {
      const hashedPassword = await UserModel.hashPassword(data.password);
      return await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          address: data.address
        }
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002' && error.meta && typeof error.meta.target === 'string' && error.meta.target.includes('email')) {
          throw new Error("Email already exists");
        }
      }
      throw error;
    }
  }

  async getUsers() {
    try {
      return await prisma.user.findMany({
        where: {
          visible: true
        },
        orderBy: {
          email: 'asc'
        },
        include: {
          loans: {}
        }
      });
    } catch (error: unknown) {
      throw error;
    }
  }

  async getUserById(id: string) {
    try {
      return await prisma.user.findUnique({
        where: {
          id,
          visible: true
        },
        include: {
          loans: {}
        }
      });
    } catch (error: unknown) {
      throw error;
    }
  }

  async getUserByEmail(email: string) {
    try {
      return await prisma.user.findUnique({
        where: {
          email,
          visible: true
        },
        include: {
          loans: {}
        }
      });
    } catch (error: unknown) {
      throw error;
    }
  }

  async updateUserById(id: string, data: UserDTO) {
    try {
      return await prisma.user.update({
        where: {
          id,
          visible: true
        },
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
          address: data.address
        }
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('User not found.');
        }
        if (error.code === 'P2002' && error.meta && typeof error.meta.target === 'string' && error.meta.target.includes('email')) {
          throw new Error("Email already exists");
        }
      }
      throw error;
    }
  }

  async deleteUserById(id: string) {
    try {
      return await prisma.user.update({
        where: {
          id,
          visible: true
        },
        data: {
          visible: false
        }
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('User not found.');
        }
      }
      throw error;
    }
  }

  static async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

}