import express from "express";
import cors from "cors";
const router = express.Router();
import {
  sendMailNow,
  allTemplates,
  passwordRecovery,
  changePassword,
  celebrantsDayMail,
  singleTemplate,
  updateTemplate,
} from "../controllers/emailSenderController.js";
import schedule from "node-schedule";
const app = express();

app.use(cors());

router.post("/sendEmail", cors({ origin: "*" }), sendMailNow);
router.post("/birthdayEmail", cors({ origin: "*" }), celebrantsDayMail);
router.get("/fetchAllTemplates", cors({ origin: "*" }), allTemplates);
router.get("/fetchTemplate/:id", cors({ origin: "*" }), singleTemplate);
router.post("/updateTemplate", cors({ origin: "*" }), updateTemplate);
router.post("/recoverPassword", cors({ origin: "*" }), passwordRecovery);
router.post("/resetPassword", cors({ origin: "*" }), changePassword);
router.get("/resource/:resname", cors({ origin: "*" }), singleTemplate);

export default router;
