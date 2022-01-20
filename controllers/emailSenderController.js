import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";
import asyncHandler from "express-async-handler";
import mssql from "mssql";
import bodyParser from "body-parser";
import express from "express";
import { createRequire } from "module";
import Joi from 'joi'

//Send in the midnight
// schedule.scheduleJob('0 0 * * *', () => {})
const require = createRequire(import.meta.url);
const app = express()


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
// api key https://sendgrid.com/docs/Classroom/Send/api_keys.html
var options = {
    auth: {
        api_key: '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'
    }
}
 
// or
 
// username + password
var options = {
    auth: {
        api_user: 'philip',
        api_key: '@Naopemipo08136895580'
    }
}

const allTemplates = asyncHandler(async (req, res) => {
  try {
    let pool = await mssql.connect(sqlConfig);
    let result = await pool.request().query("select * from [dbo].[MessageTemplates]");
    console.log(result);
    res.json(result);
    mssql.close;
  } catch (error) {
    console.log(error.message);
    mssql.close;
  }
});

const singleTemplate =  asyncHandler(async (req, res) => {
let messageId = req.params.id;
try {

  let pool = await mssql.connect(sqlConfig);
  let result = await pool.request().query(`select * from [dbo].[MessageTemplates] where Id = ${messageId}`);
  console.log(result);
  res.json(result);
  mssql.close;
} catch (error) {
  console.log(error.message);
  mssql.close;
}
});

const updateTemplate =  asyncHandler(async (req, res) => {
  let messageId = req.body.id;
  let title = req.body.title;
  let msgBody = req.body.messageBody;

  console.log('here is it', messageId, title, msgBody)
  try {
  
    let pool = await mssql.connect(sqlConfig);
      let result = await pool.request().query(`UPDATE [dbo].[MessageTemplates] SET Title = '${title}', Body = '${msgBody}' WHERE Id = ${messageId}`);
    console.log(result);
    res.json(result);
    mssql.close;
  } catch (error) {
    res.json({isSuccessful: false, hasError: 'Something happened'})
    console.log(error.message);
    mssql.close;
  }
  });


const celebrantsDayMail = asyncHandler(async (req, res) => {
  let messageId = req.body.templateId;
  let senderId = req.body.senderId;
    try {
           //Call an endpoint to return the generatedUsers
        let result = await pool.request().query(`SELECT * FROM [dbo].[vwPatientDOBInfo]
        WHERE DATEADD (YEAR, DATEPART(YEAR, GETDATE()) - DATEPART(YEAR, DateOfBirth), DateOfBirth)
        BETWEEN CAST(GETDATE() AS DATE) AND CAST(DATEADD(DAY, 1, GETDATE())-1 AS DATE)`);
        console.log(result);
        // res.json(result);
        mssql.close;

        let record = result.recordset;

        var options = {
            auth: {
                api_key: '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'
            }
        }
            
        var mailer = nodemailer.createTransport(sgTransport(options));                   

      for(let i = 0; i< record.length; i++){
        let name = record[i].name;
        let age = Date() - record[i].DateOfBirth;;
        let gender = record[i].gender;;
        let pool = await mssql.connect(sqlConfig);
        let messageTemp = await pool.request().query(`select Body from [dbo].[MessageTemplates] where Id = ${messageId}`);
        let message = messageTemp.replace("[[name]]", name).replace("[[age]]", age).replace("[[gender]]", gender)
        console.log('Here is your message body:',message)
            var email = {
                to: [record[i].EmailAddress],
                from: senderId,
                subject: message.recordset[0].Title,
                text: message.recordset[0].Body,
                html: '<h5>Happy Birthdaty</h5>'
            }; 

            // console.log('Messagers a',allTemplates.recordset[0])

            mailer.sendMail(email, function(err, res) {
                if (err) { 
                    console.log(err) 
                }
                console.log('email sent to', record[i].EmailAddress);
               
            });
          }

        res.json({isSuccessful: true})
         
        
      
    } catch (error) {
      res.json({isSuccessful: false, hasError: 'Something happened'})
      console.log(error.message);
      mssql.close;
    }
  });

  const sendMailNow = asyncHandler(async (req, res) => {
    let messageId = req.body.templateId;
    let userData = JSON.parse(req.body.UsersData);
    // let userData = req.body.UsersData;
    let senderName = req.body.senderName;

    console.log('Here is your data',userData)
    var options = {
      auth: {
          api_key: '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'
      }
  }
  var mailer = nodemailer.createTransport(sgTransport(options)); 
      
      try {
        if(!messageId || !userData || !senderName){
          res.json({isSuccessful: false, hasError: 'Check what you are sending please'});
        } else {
          let pool = await mssql.connect(sqlConfig);
          let messageTemp = await pool.request().query(`select * from [dbo].[MessageTemplates] where Id = ${messageId}`);
          let messageContent = messageTemp.recordset[0].Body;
          console.log('See your message template:', messageTemp)
          for(let i = 0; i < userData.length; i++){
            if(userData[i].EmailAddress){
              let name = userData[i].name;
              let age = userData[i].age;
              let gender  = userData[i].gender;
    
              messageContent = messageContent.replace("[[name]]", name).replace("[[age]]", age).replace("[[gender]]", gender);
              var email = {
                to: [userData[i].EmailAddress],
                from: "philipmuyiwa@gmail.com",
                subject: messageTemp.recordset[0].Title,
                text: messageContent,
                html: `<h5>${messageTemp.recordset[0].Title}</h5>`
            }

              mailer.sendMail(email, function(err, res) {
                if (err) { 
                    console.log(err) 
                }
                else console.log('email sent to', userData[i].EmailAddress);
              
              });
          }; 

          // console.log('Messagers a',allTemplates.recordset[0])

         
  
          }       
   
          res.json({isSuccessful: true})
           
        } 
        
      } catch (error) {
        res.json({isSuccessful: false, hasError: 'Something happened'})
        console.log(error.message);
        mssql.close;
      }
    });

    // const bodyParser = require('body-parser');

const credentials = {
    apiKey: '012960fc8cad6546d2a9e790219cd034602ae9df0bb747c5d188064d840f7f91',
    username: 'sandbox' // username is sandbox for sandbox applications
    }
    
    const AT = require('africastalking')(credentials);
    const sms = AT.SMS;
    
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());   
    
const brithdaySMS = asyncHandler(async (req, res) => {
    let pool = await mssql.connect(sqlConfig);    
    let messageTemp = await pool.request().query(`select Body from [dbo].[MessageTemplates] where title = 'Birthday'`);
    let result = await pool.request().query(`SELECT * FROM [dbo].[vwPatientDOBInfo]
    WHERE DATEADD (YEAR, DATEPART(YEAR, GETDATE()) - DATEPART(YEAR, DateOfBirth), DateOfBirth)
    BETWEEN CAST(GETDATE() AS DATE) AND CAST(DATEADD(DAY, 1, GETDATE())-1 AS DATE)`);
    mssql.close;
    console.log('Here is your result', result.recordset)
    let record = result.recordset;
      
      // create const options with fields to and message
      for(let i = 0; i< record.length; i++){
        let name = userData[i].name;
        let message = messageTemp.replace("[[name]]", name);
        console.log('Here is your message body:',message);
        let PhoneNumber = ('+234'.concat(record[i].PhoneNo));
        const options = {
            to: [PhoneNumber],
            message: message || 'Happy birthday',
            shortCode: 'HMS',
            keyword: 'Happy Birthday', // set your premium keyword
            retryDurationInHours: 12 
          }

          console.log('sent boss:', PhoneNumber)
    
          sms.send(options).then(info => {
            // return information from Africa's Talking
            console.log('Messeage sent to:', PhoneNumber)
          }).catch(err => {
            console.log(err);
          });
          console.log('SMS sent to', PhoneNumber);
      } 

      res.json(record);
      // res.json({isSuccessful: true})
      // That's it. AT will then send your SMSs to your Simulators
      
    // })
});

const sendSMSNow = asyncHandler(async (req, res) => {
  let messageId = req.body.templateId;
  let userData = req.body.UsersData;
  let senderName = req.body.senderName;
  let pool = await mssql.connect(sqlConfig);   
  let messageTemp = await pool.request().query(`select Body from [dbo].[MessageTemplates] where Id = ${messageId}`); 
  mssql.close;
    // create const options with fields to and message
    for(let i = 0; i< userData.length; i++){
      let name = userData[i].name;
      let age = userData[i].age;
      let gender  = userData[i].gender;
      let message = messageTemp.replace("[[name]]", name).replace("[[age]]", age).replace("[[gender]]", gender)
      let PhoneNumber = ('+234'.concat(userData[i].PhoneNo));
      const options = {
          to: [PhoneNumber],
          message: message || 'Happy birthday',
          shortCode: senderName,
          keyword: ' ', // set your premium keyword
          retryDurationInHours: 12 
        }

        console.log('sent boss:', PhoneNumber)
  
        sms.send(options).then(info => {
          // return information from Africa's Talking
          console.log('Messeage sent to:', PhoneNumber)
        }).catch(err => {
          console.log(err);
        });
        console.log('SMS sent to', PhoneNumber);
    } 

    res.json(record);
    // res.json({isSuccessful: true})
    // That's it. AT will then send your SMSs to your Simulators
    
  // })
});

const saveTemplate = asyncHandler(async (req, res) => {
  let tempTitle = req.body.title;
  let tempBody = req.body.messageBody;
  console.log('here is the template sent', tempTitle, tempBody)
  try {
    let pool = await mssql.connect(sqlConfig); 
    let result = await pool.request().query(`INSERT into [dbo].[MessageTemplates](Title, Body) VALUES('${tempTitle}','${tempBody}')`);
    mssql.close;
    console.log('Here is your new template', result);
    res.json({hasError: false, message: 'Record saved sucessfully'})
  }
  catch (error) {
    res.json({isSuccessful: false, hasError: 'Something happened'})
    console.log(error.message);
    mssql.close;

  }

});

  
  export {sendMailNow, brithdaySMS, sendSMSNow, allTemplates, saveTemplate, singleTemplate, updateTemplate, celebrantsDayMail};