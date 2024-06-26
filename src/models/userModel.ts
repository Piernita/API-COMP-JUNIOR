import { PrismaClient, Prisma } from '@prisma/client';
import UserDTO from '../dtos/userDTO';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();


export class UserModel {

  async createUser(data: UserDTO) {
    try {
      const basicRole = await prisma.role.findUnique({
        where: { name: "basic user" },
      });
      if (!basicRole) {
        throw new Error("Role 'basic user' not found");
      }
      const hashedPassword = await UserModel.hashPassword(data.password);
      return await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          address: data.address,
          roles: {
            connect: {
              id: basicRole.id
            }
          }
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
          loans: {},
          roles: {},
          permissions: {}
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
          loans: {},
          roles: {
            include: {
              permissions: true
            }
          },
          permissions: {}
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
          loans: {},
          roles: {},
          permissions: {}
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

  async updateUserPassword(id: string, password: string) {
    try {
      const hashedPassword = await UserModel.hashPassword(password);
      return await prisma.user.update({
        where: {
          id,
          visible: true
        },
        data: {
          password: hashedPassword
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

  async addRoleToUser(id: string, roleId: string[]) {
    try {
      return await prisma.user.update({
        where: {
          id,
          visible: true
        },
        data: {
          roles: {
            connect: roleId.map(roleId => ({ id: roleId }))
          }
        }
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Roles not found.');
        }
        else if (error.code === 'P2016') {
          throw new Error('User not found.');
        }
      }
      throw error;
    }
  }

  async removeRoleFromUser(id: string, roleId: string[]) {
    try {
      return await prisma.user.update({
        where: {
          id,
          visible: true
        },
        data: {
          roles: {
            disconnect: roleId.map(roleId => ({ id: roleId }))
          }
        }
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Role not found.');
        }
        else if (error.code === 'P2016') {
          throw new Error('User not found.');
        }
      }
      throw error;
    }
  }

  async hasRole(id: string, roleId: string[]) {
    try {
      return await prisma.user.findFirst({
        where: {
          id,
          roles: {
            some: {
              id: {
                in: roleId.map(roleId => roleId)
              }
            }
          }
        }
      });
    } catch (error: unknown) {
      throw error;
    }
  }

  async addPermissionToUser(id: string, permissionId: string[]) {
    try {
      return await prisma.user.update({
        where: {
          id,
          visible: true
        },
        data: {
          permissions: {
            connect: permissionId.map(permissionId => ({ id: permissionId }))
          }
        }
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Permissions not found.');
        }
        else if (error.code === 'P2016') {
          throw new Error('User not found.');
        }
      }
      throw error;
    }
  }

  async removePermissionFromUser(id: string, permissionId: string[]) {
    try {
      return await prisma.user.update({
        where: {
          id,
          visible: true
        },
        data: {
          permissions: {
            disconnect: permissionId.map(permissionId => ({ id: permissionId }))
          }
        }
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Permission not found.');
        }
        else if (error.code === 'P2016') {
          throw new Error('User not found.');
        }
      }
      throw error;
    }
  }

  async hasPermission(id: string, permissionId: string[]) {
    try {
      return await prisma.user.findFirst({
        where: {
          id,
          permissions: {
            some: {
              id: {
                in: permissionId.map(permissionId => permissionId)
              }
            }
          }
        }
      });
    } catch (error: unknown) {
      throw error;
    }
  }

}
