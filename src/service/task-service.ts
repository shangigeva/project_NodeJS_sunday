import { ITaskInput } from "../@types/task";
import { Task } from "../database/model/tasks";
const createTask = async (data: ITaskInput, userId: string) => {
  //TaskNumb, userId
  const maxTask = await Task.findOne({}, {}, { sort: { TaskNumb: -1 } });
  const taskNumb = maxTask ? maxTask.TaskNumb! + 1 : 1;

  // Task.userId = userId;
  //random number that does not exist in the database:
  const task = new Task({
    ...data,
    TaskNumb: taskNumb,
  });

  return task.save();
};

export { createTask };
