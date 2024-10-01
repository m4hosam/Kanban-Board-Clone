import prisma from "../client";
import { Task } from "../models/Task";

export class TaskService {
  async createTask(title: string, description: string): Promise<Task> {
    try {
      return await prisma.task.create({
        data: {
          title,
          description,
          status: "To Do",
        },
      });
    } catch (error) {
      console.error("Prisma error:", error);
      throw error; // You can customize the error handling further
    }
  }

  async getAllTasks(): Promise<Task[]> {
    return prisma.task.findMany();
  }

  async getTaskById(id: string): Promise<Task | null> {
    return prisma.task.findUnique({ where: { id } });
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    return prisma.task.update({
      where: { id },
      data: updates,
    });
  }

  async deleteTask(id: string): Promise<boolean> {
    try {
      await prisma.task.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}

export const taskService = new TaskService();
