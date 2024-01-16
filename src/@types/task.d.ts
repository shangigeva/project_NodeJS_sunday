type ITaskInput = {
  title: string;
};
export type ITask = ITaskInput & {
  //JWT=> userid
  TaskNumb?: number;
  _id?: string;
  createdAt: Date;
  title: string;
  subtitle: string;
  status: String;
  priority: String;
  label: String;
  owner: String;
};
