import { Logger } from "../logs/logger";
import { Task } from "./model/tasks";
import { User } from "./model/user";
import { tasks } from "./tasks";
import { users } from "./users";
const initDB = async () => {
  //add 3 users
  const usersCount = await User.countDocuments();
  if (usersCount != 0) return;
  for (let user of users) {
    const saved = await new User(user).save();
    Logger.verbose("Added user: ", saved);
  }

  //add 3 tasks
  const taskCount = await Task.countDocuments();
  if (taskCount != 0) return;
  for (let task of tasks) {
    const saved = await new Task(task).save();
    Logger.verbose("Added task: ", saved);
  }
};

export { initDB };
