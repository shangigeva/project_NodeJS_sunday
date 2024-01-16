class TaskError extends Error {
  //props
  status: number;
  //constructor
  constructor(message: string, status: number) {
    super(message);

    this.status = status;
  }
}

export { TaskError };
