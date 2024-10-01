import { taskService } from "../services/TaskService"; // Adjust the path to your service file
import { prismaMock } from "../singleton";

describe("TaskService", () => {
  const mockTask = {
    id: "1",
    title: "Test Task",
    description: "Test Description",
    status: "PENDING",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe("createTask", () => {
    it("should create a new task", async () => {
      (prismaMock.task.create as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskService.createTask(
        mockTask.title,
        mockTask.description,
        mockTask.status
      );

      expect(result).toEqual(mockTask);
      expect(prismaMock.task.create).toHaveBeenCalledWith({
        data: {
          title: mockTask.title,
          description: mockTask.description,
          status: mockTask.status,
        },
      });
    });
    it("should throw an error if Prisma fails", async () => {
      const error = new Error("Prisma Error");
      (prismaMock.task.create as jest.Mock).mockRejectedValue(error);

      await expect(
        taskService.createTask(
          mockTask.title,
          mockTask.description,
          mockTask.status
        )
      ).rejects.toThrow("Prisma Error");
    });
  });

  describe("getAllTasks", () => {
    it("should return all tasks", async () => {
      (prismaMock.task.findMany as jest.Mock).mockResolvedValue([mockTask]);

      const result = await taskService.getAllTasks();

      expect(result).toEqual([mockTask]);
      expect(prismaMock.task.findMany).toHaveBeenCalledTimes(1);
    });

    it("should return an empty array if no tasks exist", async () => {
      (prismaMock.task.findMany as jest.Mock).mockResolvedValue([]);

      const result = await taskService.getAllTasks();

      expect(result).toEqual([]);
      expect(prismaMock.task.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("getTaskById", () => {
    it("should return a task by ID", async () => {
      (prismaMock.task.findUnique as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskService.getTaskById(mockTask.id);

      expect(result).toEqual(mockTask);
      expect(prismaMock.task.findUnique).toHaveBeenCalledWith({
        where: { id: mockTask.id },
      });
    });

    it("should return null if no task is found", async () => {
      (prismaMock.task.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await taskService.getTaskById(mockTask.id);

      expect(result).toBeNull();
      expect(prismaMock.task.findUnique).toHaveBeenCalledWith({
        where: { id: mockTask.id },
      });
    });
  });

  describe("updateTask", () => {
    it("should update a task", async () => {
      const updatedTask = { ...mockTask, title: "Updated Title" };
      (prismaMock.task.update as jest.Mock).mockResolvedValue(updatedTask);

      const result = await taskService.updateTask(mockTask.id, {
        title: "Updated Title",
      });

      expect(result).toMatchObject({
        ...mockTask,
        title: "Updated Title",
      });
      expect(prismaMock.task.update).toHaveBeenCalledWith({
        where: { id: mockTask.id },
        data: { title: "Updated Title" },
      });
    });

    it("should throw an error if Prisma fails", async () => {
      const error = new Error("Prisma Error");
      (prismaMock.task.update as jest.Mock).mockRejectedValue(error);

      await expect(
        taskService.updateTask(mockTask.id, { title: "Updated Title" })
      ).rejects.toThrow("Prisma Error");
    });
  });

  describe("deleteTask", () => {
    it("should delete a task", async () => {
      (prismaMock.task.delete as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskService.deleteTask(mockTask.id);

      expect(result).toBe(true);
      expect(prismaMock.task.delete).toHaveBeenCalledWith({
        where: { id: mockTask.id },
      });
    });

    it("should return false if Prisma fails to delete", async () => {
      (prismaMock.task.delete as jest.Mock).mockRejectedValue(
        new Error("Prisma Error")
      );

      const result = await taskService.deleteTask(mockTask.id);

      expect(result).toBe(false);
      expect(prismaMock.task.delete).toHaveBeenCalledWith({
        where: { id: mockTask.id },
      });
    });
  });
});
