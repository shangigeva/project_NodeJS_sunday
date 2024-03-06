type IProjectInput = {
  label: string;
};

export type IProject = IProjectInput & {
  id: string;
  createTime: Date;
  value: String;
};
