import { Request, Response } from "express";
import { taskService } from "../services/TaskService";

export class TaskController {
  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, status } = req.body;
      if (!title || !status) {
        res
          .status(400)
          .json({ message: "Missing required fields Title-Status" });
        return;
      }
      const newTask = await taskService.createTask(title, description, status);
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ message: "Error creating task", error });
    }
  }

  async getAllTasks(_req: Request, res: Response): Promise<void> {
    try {
      const tasks = await taskService.getAllTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving tasks", error });
    }
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;
      const task = await taskService.getTaskById(id);
      // Check if task exists
      if (!task) {
        res.status(404).json({ message: "Task not found" });
        return;
      }
      // Update task
      const updatedTask = await taskService.updateTask(id, updates);
      if (updatedTask) {
        res.json(updatedTask);
      } else {
        // Couldn't update task
        res.status(402).json({ message: "Couldn't update task" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error updating task", error });
    }
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await taskService.deleteTask(id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Task not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error deleting task", error });
    }
  }
}
