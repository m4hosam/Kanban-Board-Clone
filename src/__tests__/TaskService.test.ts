import { TaskService } from "../services/TaskService";
import { prismaMock } from "../singleton";

jest.mock("@prisma/client");

describe("TaskService", () => {
  let taskService: TaskService;

  beforeEach(() => {
    taskService = new TaskService();
  });

  describe("createTask", () => {
    it("should create a new task", async () => {
      const mockTask = {
        id: "e0545c65-1855-4c37-a985-c3d936521df9",
        title: "Test Task",
        description: "This is a test task",
        status: "To Do",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.task.create.mockResolvedValue(mockTask);

      const result = await taskService.createTask(
        "Test Task",
        "This is a test task"
      );
      expect(result).toEqual(mockTask);
      expect(prismaMock.task.create).toHaveBeenCalledWith({
        data: {
          title: "Test Task",
          description: "This is a test task",
          status: "To Do",
        },
      });
    });
  });

  describe("getAllTasks", () => {
    it("should return all tasks", async () => {
      const mockTasks = [
        {
          id: "1",
          title: "Task 1",
          description: "Description 1",
          status: "To Do",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          title: "Task 2",
          description: "Description 2",
          status: "In Progress",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      prismaMock.task.findMany.mockResolvedValue(mockTasks);

      const result = await taskService.getAllTasks();
      expect(result).toEqual(mockTasks);
      expect(prismaMock.task.findMany).toHaveBeenCalled();
    });
  });

  // Add more tests for updateTask, deleteTask, and updateTaskPartial methods
});
