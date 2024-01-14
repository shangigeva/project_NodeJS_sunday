type ITaskInput = {
  title: string;
};
export type ITask = ITaskInput & {
  //JWT=> userid
  TaskNumb?: number;
  userId?: string;
  _id?: string;
  createdAt: Date;
  title: string;
  status: String;
  priority: String;
  label: String;
};
