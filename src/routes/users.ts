import { Router } from "express";
import { ILogin, IUser } from "../@types/user";
import { User } from "../database/model/user";
import { validateLogin, validateRegistration } from "../middleware/validation";
import { createUser, validateUser } from "../service/user-service";
import { isAdmin } from "../middleware/is-admin";
import { isAdminOrUser } from "../middleware/is-admin-or-user";
import { isUser } from "../middleware/is-user";
import { auth } from "../service/auth-service";
import { Logger } from "../logs/logger";

const router = Router();
// GET all users
router.get("/users", async (req, res, next) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  } catch (e) {
    next(e);
  }
});

// EDIT user
router.put("/:id", isUser, validateRegistration, async (req, res, next) => {
  //hash the password:
  req.body.password = await auth.hashPassword(req.body.password);
  const savedUser = await User.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true }
  );
  res.json(savedUser);
});

// GET a user
router.get("/:id", isAdminOrUser, async (req, res, next) => {
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
router.delete("/:id", isAdminOrUser, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteUser = await User.findOneAndDelete({ _id: id });
    Logger.verbose("deleted the user");
    return res.json(deleteUser);
  } catch (e) {
    next(e);
  }
});
export { router as usersRouter };
