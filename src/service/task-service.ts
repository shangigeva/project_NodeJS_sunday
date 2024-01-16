import { ITaskInput } from "../@types/task";
import { Task } from "../database/model/tasks";
const createTask = async (data: ITaskInput, userId: string) => {
  //TaskNumb, userId
  const task = new Task(data);

  // Task.userId = userId;
  //random number that does not exist in the database:
  while (true) {
    const random = Math.floor(Math.random() * 1_000_000);
    const dbRes = await Task.findOne({ TaskNumb: random });
    if (!dbRes) {
      // Task.TaskNumb = random;
      break;
    }
  }

  return task.save();
};

export { createTask };
