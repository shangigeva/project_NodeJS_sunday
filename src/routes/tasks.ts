import { Router } from "express";
import { auth } from "../service/auth-service";
import { validateTask } from "../middleware/validation";
import { ITask, ITaskInput } from "../@types/task";
import { validateToken } from "../middleware/validate-token";
import { TaskError } from "../error/tasks-error";
import { isUser } from "../middleware/is-user";
import { isAdmin } from "../middleware/is-admin";
import { createTask } from "../service/task-service";
import { Task } from "../database/model/tasks";

const router = Router();
type SortOrder = "asc" | "desc";

// CREATE TASK
router.post("/", validateTask, validateToken, async (req, res, next) => {
  try {
    console.log("imer the ");
    console.log(req.user);

    const userId = req.user?._id;
    if (!userId) {
      throw new TaskError("Task must have an id", 500);
    }
    const saveTask = await createTask(req.body as ITaskInput, userId);
    res.status(201).json({ message: "task saved", task: saveTask });
  } catch (e) {
    next(e);
  }
});
// GET ALL TASK
router.get("/", validateToken, async (req, res, next) => {
  try {
    const sortBy = req.query.sortBy || "desc";
    const sortOrder: SortOrder = sortBy === "asc" ? "asc" : "desc";

    const allTasks = await Task.find().sort({ createTime: sortOrder });

    console.log(allTasks);

    return res.json(allTasks);
  } catch (e) {
    next(e);
  }
});
// fetch all data for cards uin dashboard page. /dashboard
router.get("/getDashboardData", validateToken, async (req, res, next) => {
  try {
    const createdToday = await Task.countDocuments({
      createTime: {
        $gte: new Date().setHours(0, 0, 0, 0),
      },
    });
    const closeToday = await Task.countDocuments({
      createTime: {
        $gte: new Date().setHours(0, 0, 0, 0),
      },
      status: "done",
    });

    const closeTasks = await Task.countDocuments({ status: "done" });
    const openTasks = await Task.countDocuments({
      status: { $in: ["backlog", "todo", "in progress"] },
    });

    console.log("open tasks:" + openTasks);

    return res.json({ openTasks, closeTasks, createdToday, closeToday });
  } catch (e) {
    next(e);
  }
});
// fetch all data for cards uin dashboard page. /dashboard
router.get("/getChartData", validateToken, async (req, res, next) => {
  try {
    const data = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }, // this means that the count will increment by 1
        },
      },
    ]);
    return res.json(data);
  } catch (e) {
    next(e);
  }
});
// RECENT TASK /DASHBOARD
router.get("/recentTasks", validateToken, async (req, res, next) => {
  try {
    const sortBy = req.query.sortBy || "desc";
    const sortOrder: SortOrder = sortBy === "asc" ? "asc" : "desc";

    const allTasks = await Task.find().sort({ createTime: sortOrder }).limit(5);

    return res.json(allTasks);
  } catch (e) {
    next(e);
  }
});
// GET MY tasks
router.get("/mytasks", validateToken, async (req, res, next) => {
  try {
    const userId = req.user?._id!;
    const tasks = await Task.find({ owner: userId });
    return res.json(tasks);
  } catch (e) {
    next(e);
  }
});
// GET CARD BY ID
router.get("/:id", validateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    console.log(task);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.json(task);
  } catch (e) {
    console.error("Error fetching task details:", e);
    next(e);
  }
});
// EDIT TASK
router.put("/:id", validateTask, validateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    if (!userId) {
      throw new TaskError("User must have an id", 500);
    }
    const task = await Task.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!task) {
      return res
        .status(404)
        .json({ error: "Task not found or user does not have permission" });
    }

    res.json({ task });
  } catch (e) {
    next(e);
  }
});
// DELETE TASK
router.delete("/:id", isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteCard = await Task.findByIdAndDelete(id);

    if (!deleteCard) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.json(deleteCard);
  } catch (e) {
    next(e);
  }
});

// LIKE CARD
router.patch("/:id", validateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    if (!userId) {
      throw new TaskError("User must have an id", 500);
    }
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: "task not found" });
    }
    await task.save();
    res.json({ task });
  } catch (e) {
    next(e);
  }
});
// CHANGE TaskNumb
router.patch("/:id/changeBizNum", isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { TaskNumb } = req.body;
    if (!TaskNumb) {
      return res
        .status(400)
        .json({ error: "TaskNumb is required for PATCH request" });
    }
    const task = await Task.findOneAndUpdate(
      { _id: id },
      { TaskNumb },
      {
        new: true,
      }
    );
    if (!task) {
      return res
        .status(404)
        .json({ error: "Task not found or user does not have permission" });
    }
    res.json({ task });
  } catch (e) {
    next(e);
  }
});
//

export { router as taskRouter };
