class Logger {
  static error(...messages: any[]) {
    console.error(messages);
  }

  static info(...messages: any[]) {
    if (process.env.NODE_ENV === "prod") return;
    console.error(messages);
  }
  static success(...messages: any[]) {
    console.error(messages);
  }

  static debug(...messages: any[]) {
    console.debug(messages);
  }

  static verbose(...messages: any[]) {
    if (process.env.NODE_ENV === "prod") return;
    console.log(messages);
  }

  static log(...messages: any[]) {
    if (process.env.NODE_ENV === "prod") return;
  }
}

export { Logger };
