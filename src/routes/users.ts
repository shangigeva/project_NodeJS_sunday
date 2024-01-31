import { Router } from "express";
import { ILogin, IUser } from "../@types/user";
import { User } from "../database/model/user";
import {
  validateEditUser,
  validateLogin,
  validateRegistration,
} from "../middleware/validation";
import { createUser, validateUser } from "../service/user-service";
import { isAdmin } from "../middleware/is-admin";
import { isAdminOrUser } from "../middleware/is-admin-or-user";
import { isUser } from "../middleware/is-user";
import { auth } from "../service/auth-service";
import { Logger } from "../logs/logger";
import { validateToken } from "../middleware/validate-token";

const router = Router();
// GET all users
router.get("/allusers", async (req, res, next) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  } catch (e) {
    next(e);
  }
});

// EDIT user
router.put(
  "/:id",
  isAdmin,
  validateToken,
  validateEditUser,
  async (req, res, next) => {
    //hash the password:
    const savedUser = await User.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.json(savedUser);
  }
);

// GET a user
router.get("/:id", validateToken, async (req, res, next) => {
  console.log(req.params);
  try {
    const { id } = req.params;
    const user = (await User.findById(id).lean()) as IUser;
    const { password, ...rest } = user;
    return res.json({ user: rest });
  } catch (e) {
    next(e);
  }
});

// REGISTER
router.post("/register", validateRegistration, async (req, res, next) => {
  try {
    const saved = await createUser(req.body as IUser);
    res.status(201).json({ message: "Saved", user: saved });
  } catch (err) {
    next(err);
  }
});

// LOGIN
router.post("/login", validateLogin, async (req, res, next) => {
  try {
    // Extract data from the request
    const { email, password } = req.body as ILogin;
    console.log(req.body);

    try {
      const jwt = await validateUser(email, password);
      console.log(jwt);

      // Successful login
      res.json(jwt);
    } catch (e) {
      // Failed login
      Logger.error("Login failed:", e);
      // Check if the user is blocked
      if (e === "User is blocked. Try again later.") {
        // Send a response indicating that the user is blocked
        return res
          .status(401)
          .json({ error: "User is blocked. Try again later." });
      } else {
        // Send a generic error response
        res.status(401).json({ error: "Invalid email or password." });
        const userId = req.user?._id;
        if (userId) {
          try {
            // Handle failed login attempts for the user
            await auth.handleFailedLogin(userId);
          } catch (error) {
            console.error("Failed to handle login:", error);
          }
        }
      }
    }
  } catch (error) {
    // Handle other errors
    next(error);
  }
});

// DELETE USER
router.delete("/:id", isAdmin, validateToken, async (req, res, next) => {
  console.log("nana", req.params);

  try {
    const { id } = req.params;
    // check if the user im tryng to delete is noy myself
    if (req.user && id === req.user._id!.toString()) {
      return res.status(403).json({ error: "Cannot delete yourself" });
    }
    const deleteUser = await User.findOneAndDelete({ _id: id });
    if (!deleteUser) {
      return res.status(404).json({ error: "User not found" });
    }
    Logger.verbose("Deleted the user");
    return res.json(deleteUser);
  } catch (e) {
    Logger.error(`Error deleting user: ${e}`);
    res.status(500).json({ error: "Internal Server Error" });
    next(e);
  }
});

// UPGRADE TO ADMIN
router.patch("/:id", isAdmin, validateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isAdmin } = req.body;
    if (typeof isAdmin !== "boolean") {
      return res.status(400).json({ message: "Invalid isAdmin value" });
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { $set: { isAdmin: isAdmin } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    Logger.verbose("updated the user's isBusiness property");
    return res.status(200).json({ message: "Update successful", updatedUser });
  } catch (e) {
    next(e);
  }
});
export { router as usersRouter };
