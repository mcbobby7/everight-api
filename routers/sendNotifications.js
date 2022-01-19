import express from "express";
import cors from "cors";
const router = express.Router();
import { sendMailNow, sendSMSNow, allTemplates, celebrantsDayMail, singleTemplate, updateTemplate, saveTemplate, brithdaySMS} from "../controllers/emailSenderController.js";
import schedule from 'node-schedule'
const app = express();

app.use(cors());

router.post("/sendEmail", cors({origin: '*'}), sendMailNow);
router.post("/sendsms", cors({origin: '*'}), sendSMSNow);
router.post("/birthday", cors({origin: '*'}), brithdaySMS);
router.post("/birthdayEmail", cors({origin: '*'}), celebrantsDayMail);
router.get("/fetchAllTemplates", cors({origin: '*'}), allTemplates);
router.get("/fetchTemplate/:id", cors({origin: '*'}), singleTemplate);
router.post("/updateTemplate", cors({origin: '*'}), updateTemplate);
router.post("/addTemplate", cors({origin: '*'}), saveTemplate);

export default router;