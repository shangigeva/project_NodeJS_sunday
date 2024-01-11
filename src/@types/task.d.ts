type ITaskInput = {
  title: string;
};
export type ITask = ITaskInput & {
  //JWT=> userid
  //bizNumber => random Unique
  bizNumber?: number;
  userId?: string;
  _id?: string;
  createdAt: Date;
};
