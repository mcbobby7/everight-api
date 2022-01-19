import express from "express";
import cors from "cors";
const router = express.Router();
import { getReceipts } from "../controllers/lola_chat.js";

const app = express();

app.use(cors());

router.get("/", cors({origin: '*'}), getReceipts);

export default router;