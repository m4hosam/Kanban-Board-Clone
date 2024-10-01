// import { taskService } from "../services/TaskService"; // Adjust the path to your service file
// import { prismaMock } from "../singleton";

// test("should create a new task", async () => {
//   const mockTask = {
//     id: "1",
//     title: "Test Task",
//     description: "Test Description",
//     status: "PENDING",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   };

//   prismaMock.task.create.mockResolvedValue(mockTask);

//   await expect(
//     taskService.createTask(
//       mockTask.title,
//       mockTask.description,
//       mockTask.status
//     )
//   ).resolves.toEqual({
//     title: "Test Task",
//     description: "Test Description",
//     status: "PENDING",
//   });
// });
