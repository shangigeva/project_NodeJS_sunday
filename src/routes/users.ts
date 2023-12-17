import { Router } from "express";
import { ILogin, IUser } from "../@types/user";
import { User } from "../database/model/user";
import { validateLogin, validateRegistration } from "../middleware/validation";
import { createUser, validateUser } from "../service/user-service";
import { isAdmin } from "../middleware/is-admin";
import { isAdminOrUser } from "../middleware/is-admin-or-user";
import { isUser } from "../middleware/is-user";
import { auth } from "../service/auth-service";

const router = Router();
// GET all users
router.get("/", isAdmin, async (req, res, next) => {
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
  //not null check
  //remove the password
  res.json(savedUser);
});
// GET a user
router.get("/:id", isAdminOrUser, async (req, res, next) => {
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
router.post("/", validateRegistration, async (req, res, next) => {
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
    //check the request:
    const { email, password } = req.body as ILogin;

    //call the service:
    const jwt = await validateUser(email, password);

    //response
    res.json(jwt);
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", isUser, validateRegistration, async (req, res) => {
  try {
  } catch {}
});

export { router as usersRouter };

//Database:
//connect, mongo-schema, model
//Router:
//validate body (joi-schema), other route logic
