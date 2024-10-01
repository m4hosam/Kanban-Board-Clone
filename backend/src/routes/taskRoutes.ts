import express from "express";
import { TaskController } from "../controllers/TaskController";

const router = express.Router();
const taskController = new TaskController();

router.post("/", taskController.createTask);
router.get("/", taskController.getAllTasks);
router.delete("/", taskController.deleteAllTasks);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;
