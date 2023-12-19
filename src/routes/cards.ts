import { Router } from "express";
import { Card } from "../database/model/cards";
import { auth } from "../service/auth-service";
import { validateCard } from "../middleware/validation";
import { ICard } from "../@types/card";
import { isBusinessUser } from "../middleware/is-business";

const router = Router();
// CREATE CARD
router.post("/", isBusinessUser, validateCard, async (req, res, next) => {
  try {
    const saveCard = await Card.create(req.body as ICard);
    res.status(201).json({ message: "Saved", user: saveCard });
  } catch (err) {
    next(err);
  }
});
// GET ALL CARDS
router.get("/", async (req, res) => {
  try {
    const allCards = await Card.find();
    res.json(allCards);
  } catch (error) {
    res.status(500).json({ message: "server error", error });
  }
});

// GET MY CARDS
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
