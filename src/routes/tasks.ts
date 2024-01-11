import { Router } from "express";
import { auth } from "../service/auth-service";
import { validateTask } from "../middleware/validation";
import { ITask, ITaskInput } from "../@types/task";
import { validateToken } from "../middleware/validate-token";
import { BizCardsError } from "../error/biz-cards-error";
import { isUser } from "../middleware/is-user";
import { isAdminOrUser } from "../middleware/is-admin-or-user";
import { isAdmin } from "../middleware/is-admin";
import { createTask } from "../service/task-service";
import { Task } from "../database/model/tasks";

const router = Router();
// CREATE TASK
router.post("/", validateTask, async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      throw new BizCardsError("User must have an id", 500);
    }
    const saveTask = await createTask(req.body as ITaskInput, userId);
    res.status(201).json({ message: "task saved", user: saveTask });
  } catch (e) {
    next(e);
  }
});
// GET ALL CARDS
router.get("/", async (req, res, next) => {
  try {
    const allTasks = await Task.find();
    return res.json(allTasks);
  } catch (e) {
    next(e);
  }
});

// GET MY CARDS
router.get("/my-cards", validateToken, async (req, res, next) => {
  try {
    const userId = req.user?._id!;
    const tasks = await Task.find({ userId });
    return res.json(tasks);
  } catch (e) {
    next(e);
  }
});
// GET CARD BY ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    return res.json(task);
  } catch (e) {
    next(e);
  }
});
// EDIT TASK
router.put("/:id", validateTask, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    if (!userId) {
      throw new BizCardsError("User must have an id", 500);
    }
    const task = await Task.findOneAndUpdate({ _id: id, userId }, req.body, {
      new: true,
    });
    if (!task) {
      return res
        .status(404)
        .json({ error: "Card not found or user does not have permission" });
    }
    res.json({ task });
  } catch (e) {
    next(e);
  }
});
// DELETE CARD
router.delete("/:id", isAdminOrUser, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteCard = await Task.findByIdAndDelete({ _id: id });
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
      throw new BizCardsError("User must have an id", 500);
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
// CHANGE BIZNUMBER
router.patch("/:id/changeBizNum", isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { bizNumber } = req.body;
    if (!bizNumber) {
      return res
        .status(400)
        .json({ error: "bizNumber is required for PATCH request" });
    }
    const task = await Task.findOneAndUpdate(
      { _id: id },
      { bizNumber },
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
export { router as taskRouter };
