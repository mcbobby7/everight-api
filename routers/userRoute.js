import express from "express";
import cors from "cors";
const router = express.Router();
import { allUsers, celebrants, weeklycelebrants, monthlycelebrants, generatedUsers } from "../controllers/userController.js";

const app = express();

app.use(cors());

router.get("/getAllUsers", cors({origin: '*'}), allUsers);
router.get("/generateUsers", cors({origin: '*'}), generatedUsers);
router.get("/getCelebrants", cors({origin: '*'}), celebrants);
router.get("/celebrants/weekly", cors({origin: '*'}), weeklycelebrants);
router.get("/celebrants/monthly", cors({origin: '*'}), monthlycelebrants);

export default router;