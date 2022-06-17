import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";
import { sqlConfig } from "../database.js";
import mssql from "mssql";

import moment from "moment";
import axios from "axios";

process.send("ready");
process.on("message", (message) => {
  sendEmail(message.userData, message.messageId, message.senderName);
});

const sendEmail = async (userData, messageId, senderName) => {
  if (senderName) {
    try {
      let pool = await mssql.connect(sqlConfig);
      let messageTemp = await pool
        .request()
        .query(`select * from [dbo].[DocTemplates] where Id = ${messageId}`);
      let messageContent;
      if (messageTemp.recordset.length > 0) {
        messageContent = messageTemp.recordset[0].Template_Text;
      } else {
        process.send("error");
      }

      process.send("confirm");
      for (let i = 0; i < userData.length; i++) {
        if (userData[i].EmailAddress) {
          let date = moment(new Date()).format("YYYY");
          let name = userData[i].PatientName;
          let age = +date - +userData[i].DateOfBirth.substring(0, 4);
          let gender = userData[i].Gender;
          let DOB = moment(new Date(userData[i].DateOfBirth)).format(
            "DD-MM-YYYY"
          );
          messageContent = messageContent
            .replace("[[name]]", name, 8)
            .replace("[[age]]", age, 8)
            .replace("[[sex]]", gender, 8)
            .replace("[[DOB]]", DOB, 8);
          if (senderName === "email") {
            const body = {
              receiver: userData[i].EmailAddress,
              msg: messageContent,
              subject: messageTemp.recordset[0].Name,
            };

            await axios
              .post(
                "http://portal.everightlab.com/notification/sendemail",
                body
              )
              .then((response) => {})
              .catch((error) => {
                console.log(error);
              });
          } else {
            const body = {
              phoneno: userData[i].PhoneNo,
              msg: messageContent.replace(/<[^>]*>?/gm, ""),
            };
            await axios
              .post("http://portal.everightlab.com/notification/sendsms", body)
              .then((response) => {})
              .catch((error) => {
                console.log(error);
              });
          }
        }
      }
    } catch (error) {
      console.log(error);
      mssql.close;
      process.send("error");
      return false;
    }
  }
};
