import { Router } from "express";
import { Card } from "../database/model/cards";
import { auth } from "../service/auth-service";

const router = Router();

// GET all cards
router.get("/", async (req, res) => {
  try {
    const allCards = await Card.find();
    res.json(allCards);
  } catch (error) {
    res.status(500).json({ message: "server error", error });
  }
});

// GET my cards
router.get("/my-cards", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]!;
    if (!token) {
      return res.status(401).json({ message: "erorrrrrr" });
    }
    const decodedToken = auth.verifyJWTUserId(token);
    const userId = decodedToken.userId;
    const myCards = await Card.find({ userId: userId });
    res.json(myCards);
  } catch (error) {
    res.status(500).json({ message: "server error", error });
  }
});

export { router as cardRouter };
