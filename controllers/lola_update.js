import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";
import asyncHandler from "express-async-handler";
import mssql from "mssql";
// import bodyParser, { json } from "body-parser";
import express from "express";
import { createRequire } from "module";
import Joi from 'joi'
import fs from 'fs'

//Send in the midnight
// schedule.scheduleJob('0 0 * * *', () => {})
const require = createRequire(import.meta.url);
const app = express()


const sqlConfig = {
    user: "superdbuser",
    password: "J@p@n123",
    database: "LOLA_LIVE_DB",
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


  fs.readFile('missing_receipts.txt', function(err, data) {
    // res.writeHead(200, {'Content-Type': 'text/html'});
    // res.write(data);
    // return res.end();
    console.log(data)
  });



const getReceipts = asyncHandler(async (req, res) => {
    try {
        let pool = await mssql.connect(sqlConfig);
        let result = await pool.request().query("select [dbo].[paymentreceipts].Id AS receipt_id, [dbo].[paymentreceipts].receipt_data AS receipt_data, [dbo].[paymentreceipts].receipt_url AS receipt_url, [dbo].[paymentlogs].RefNo AS RefNo from [dbo].[paymentreceipts] inner join [dbo].[paymentlogs] on [dbo].[paymentreceipts].PayLogId = [dbo].[paymentlogs].ID where [dbo].[paymentreceipts].TransactionDate > '2021-11-17'");
        // console.log('Here is your result:',result)
        // console.log(result);
        // res.json(result.recordsets[0]);
        const totalReceipts = [];
        result.recordsets[0].forEach(elemt => {
        console.log(elemt);

        const receipt_data = JSON.parse(elemt.receipt_data)??{}
        if(elemt.RefNo == receipt_data['WebGuid']) {
            // console.log('See your element',elemt.RefNo)
        }
            else {
                totalReceipts.push(elemt.receipt_id)
            }

        })

        let updateReceipt = `UPDATE [dbo].[paymentreceipts] SET receipt_data = NULL, receipt_url = NULL WHERE ID IN (${totalReceipts.join(',')})`;
        await pool.request().query(updateReceipt);
        console.log(updateReceipt)
        mssql.close;
        res.json({isSuccessful: true})
    
      
    } catch (error) {
      console.log(error.message);
      mssql.close;
    }
  });
  
  export {getReceipts};