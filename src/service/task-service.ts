import { IProjectInput } from "../@types/project";
import { ITaskInput } from "../@types/task";
import { Project } from "../database/model/projects";
import { Task } from "../database/model/tasks";
const createTask = async (data: ITaskInput, userId: string) => {
  //TaskNumb, userId
  const maxTask = await Task.findOne({}, {}, { sort: { TaskNumb: -1 } });
  const taskNumb = maxTask ? maxTask.TaskNumb! + 1 : 1;

  // Task.userId = userId;
  //random number that does not exist in the database:
  const task = new Task({
    ...data,
    createTime: new Date(),
    TaskNumb: taskNumb,
  });
  console.log(task);

  return task.save();
};

const createProject = async (data: IProjectInput, userId: string) => {
  const project = new Project({
    ...data,
    createTime: new Date(),
    value: data.label.toLowerCase(),
  });
  console.log(project);

  return project.save();
};

export { createTask, createProject };
