import { Request, Response } from "express";
import { TaskController } from "../controllers/TaskController";
import { taskService } from "../services/TaskService";

jest.mock("../services/TaskService");

const mockRequest = () => {
  const req = {} as Request;
  req.body = {};
  req.params = {};
  return req;
};

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("TaskController", () => {
  let taskController: TaskController;

  beforeEach(() => {
    taskController = new TaskController();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock state after each test
  });

  describe("createTask", () => {
    it("should create a new task and return 201", async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.body = {
        title: "Test Task",
        description: "Test Description",
        status: "PENDING",
      };

      const mockTask = {
        id: "1",
        title: "Test Task",
        description: "Test Description",
        status: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (taskService.createTask as jest.Mock).mockResolvedValue(mockTask);

      await taskController.createTask(req, res);

      expect(taskService.createTask).toHaveBeenCalledWith(
        "Test Task",
        "Test Description",
        "PENDING"
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it("should return 400 if required fields are missing", async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.body = { description: "Test Description" }; // Missing title and status

      await taskController.createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Missing required fields Title-Status",
      });
    });

    it("should return 500 on service error", async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.body = {
        title: "Test Task",
        description: "Test Description",
        status: "PENDING",
      };

      (taskService.createTask as jest.Mock).mockRejectedValue(
        new Error("Service error")
      );

      await taskController.createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error creating task",
        error: new Error("Service error"),
      });
    });
  });

  describe("getAllTasks", () => {
    it("should return all tasks", async () => {
      const req = mockRequest();
      const res = mockResponse();

      const mockTasks = [
        {
          id: "1",
          title: "Task 1",
          description: "Description 1",
          status: "PENDING",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          title: "Task 2",
          description: "Description 2",
          status: "DONE",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (taskService.getAllTasks as jest.Mock).mockResolvedValue(mockTasks);

      await taskController.getAllTasks(req, res);

      expect(taskService.getAllTasks).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockTasks);
    });

    it("should return 500 on service error", async () => {
      const req = mockRequest();
      const res = mockResponse();

      (taskService.getAllTasks as jest.Mock).mockRejectedValue(
        new Error("Service error")
      );

      await taskController.getAllTasks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error retrieving tasks",
        error: new Error("Service error"),
      });
    });
  });

  describe("updateTask", () => {
    it("should update the task and return the updated task", async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params.id = "1";
      req.body = { title: "Updated Task" };

      const mockTask = {
        id: "1",
        title: "Original Task",
        description: "Description",
        status: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedTask = {
        ...mockTask,
        title: "Updated Task",
      };

      (taskService.getTaskById as jest.Mock).mockResolvedValue(mockTask);
      (taskService.updateTask as jest.Mock).mockResolvedValue(updatedTask);

      await taskController.updateTask(req, res);

      expect(taskService.updateTask).toHaveBeenCalledWith("1", req.body);
      expect(res.json).toHaveBeenCalledWith(updatedTask);
    });

    it("should return 404 if task not found", async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params.id = "1";
      req.body = { title: "Updated Task" };

      (taskService.getTaskById as jest.Mock).mockResolvedValue(null);

      await taskController.updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
    });

    it("should return 500 on service error", async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params.id = "1";
      req.body = { title: "Updated Task" };

      (taskService.getTaskById as jest.Mock).mockRejectedValue(
        new Error("Service error")
      );

      await taskController.updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error updating task",
        error: new Error("Service error"),
      });
    });
  });

  describe("deleteTask", () => {
    it("should delete a task and return 204", async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params.id = "1";

      (taskService.deleteTask as jest.Mock).mockResolvedValue(true);

      await taskController.deleteTask(req, res);

      expect(taskService.deleteTask).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("should return 404 if task not found", async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params.id = "1";

      (taskService.deleteTask as jest.Mock).mockResolvedValue(false);

      await taskController.deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
    });

    it("should return 500 on service error", async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params.id = "1";

      (taskService.deleteTask as jest.Mock).mockRejectedValue(
        new Error("Service error")
      );

      await taskController.deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error deleting task",
        error: new Error("Service error"),
      });
    });
  });
});
