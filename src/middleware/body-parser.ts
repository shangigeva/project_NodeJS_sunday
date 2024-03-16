import { RequestHandler } from "express";

const bodyParser: RequestHandler = (req, res, next) => {
  console.log("omer the mor");

  if (req.header("content-type") !== "application/json") {
    return next();
  }

  //handle json body
  let body = "";

  //add each chunk to the body
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      req.body = JSON.parse(body);
      next();
    } catch (e) {
      res.status(400).json({ message: "Invalid Json" });
    }
  });
};

export default bodyParser;
export { bodyParser };
