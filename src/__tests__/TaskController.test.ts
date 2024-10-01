// import { Request, Response } from "express";
// import { TaskController } from "../controllers/TaskController";
// import { taskService } from "../services/TaskService";

// jest.mock("../services/TaskService");

// describe("TaskController", () => {
//   let taskController: TaskController;
//   let mockRequest: Partial<Request>;
//   let mockResponse: Partial<Response>;
//   let mockJson: jest.Mock;
//   let mockStatus: jest.Mock;

//   beforeEach(() => {
//     taskController = new TaskController();
//     mockJson = jest.fn();
//     mockStatus = jest.fn().mockReturnValue({ json: mockJson });
//     mockResponse = {
//       json: mockJson,
//       status: mockStatus,
//     };
//   });

//   describe("createTask", () => {
//     it("should create a new task", async () => {
//       const mockTask = {
//         id: "1",
//         title: "Test Task",
//         description: "This is a test task",
//         status: "To Do",
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };

//       mockRequest = {
//         body: { title: "Test Task", description: "This is a test task" },
//       };

//       (taskService.createTask as jest.Mock).mockResolvedValue(mockTask);

//       await taskController.createTask(
//         mockRequest as Request,
//         mockResponse as Response
//       );

//       expect(taskService.createTask).toHaveBeenCalledWith(
//         "Test Task",
//         "This is a test task"
//       );
//       expect(mockResponse.status).toHaveBeenCalledWith(201);
//       expect(mockJson).toHaveBeenCalledWith(mockTask);
//     });
//   });

//   describe("getAllTasks", () => {
//     it("should return all tasks", async () => {
//       const mockTasks = [
//         {
//           id: "1",
//           title: "Task 1",
//           description: "Description 1",
//           status: "To Do",
//         },
//         {
//           id: "2",
//           title: "Task 2",
//           description: "Description 2",
//           status: "In Progress",
//         },
//       ];

//       (taskService.getAllTasks as jest.Mock).mockResolvedValue(mockTasks);

//       await taskController.getAllTasks(
//         mockRequest as Request,
//         mockResponse as Response
//       );

//       expect(taskService.getAllTasks).toHaveBeenCalled();
//       expect(mockJson).toHaveBeenCalledWith(mockTasks);
//     });
//   });

//   // Add more tests for updateTask, deleteTask, and updateTaskPartial methods
// });
