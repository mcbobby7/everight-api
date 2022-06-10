import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";
// import asyncHandler from "express-async-handler";
import mssql from "mssql";
// import bodyParser from "body-parser";
// import express from "express";
// import { createRequire } from "module";
// import Joi from "joi";
import moment from "moment";
import axios from "axios";

process.send("ready");
process.on("message", (message) => {
  console.log(message);
  sendEmail(message.userData, message.messageId, message.senderName);
});
const sqlConfig = {
  user: "superdbuser",
  password: "J@p@n123",
  database: "hmsdb",
  server: "mssql-35101-0.cloudclusters.net",
  port: 35101,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true,
  },
};

const sendEmail = async (userData, messageId, senderName) => {
  console.log("working");
  console.log("Here is your data", userData);

  try {
    let pool = await mssql.connect(sqlConfig);
    let messageTemp = await pool
      .request()
      .query(`select * from [dbo].[MessageTemplates] where Id = ${messageId}`);
    let messageContent = messageTemp.recordset[0].Body;

    console.log("See your message template:", messageTemp);
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
          .replace("[[name]]", name)
          .replace("[[age]]", age)
          .replace("[[sex]]", gender)
          .replace("[[DOB]]", DOB);
        console.log(messageContent);
        if (senderName === "email") {
          const body = {
            receiver: userData[i].EmailAddress,
            msg: messageContent,
            subject: messageTemp.recordset[0].Title,
          };
          console.log("email", body);

          axios
            .post("http://portal.everightlab.com/notification/sendemail", body)
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          const body = {
            phoneno: "0" + userData[i].PhoneNo.substring(3),
            msg: messageContent.replace(/<[^>]*>?/gm, ""),
          };
          console.log("phone", body);
          axios
            .post("http://portal.everightlab.com/notification/sendsms", body)
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
      process.exit(1);
      return true;
    }
  } catch (error) {
    console.log(error.message);
    mssql.close;
    process.send("error");
    return false;
  }
};
