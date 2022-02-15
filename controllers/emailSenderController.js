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
      if(userData[i].PhoneNumber){
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
    } else res.json({isSuccessful: false, hasError: 'Something bad happened'})

  }

    // res.json(record);
    res.json({isSuccessful: true})
    // That's it. AT will then send your SMSs to your Simulators
    
  // })
});

const saveTemplate = asyncHandler(async (req, res) => {
  let tempTitle = req.body.title;
  let tempBody = req.body.messageBody;
  console.log('here is the template sent', tempTitle, tempBody)
  try {
    if(tempBody && tempTitle){
      let pool = await mssql.connect(sqlConfig); 
      let result = await pool.request().query(`INSERT into [dbo].[MessageTemplates](Title, Body) VALUES('${tempTitle}','${tempBody}')`);
      mssql.close;
      console.log('Here is your new template', result);
      res.json({hasError: false, message: 'Record saved sucessfully'})
    } else {
      res.json({isSuccessful: false, hasError: 'Make sure you pass the body correctly'})

    }
    
  }
  catch (error) {
    res.json({isSuccessful: false, hasError: 'Something happened'})
    console.log(error.message);
    mssql.close;

  }

});

const passwordRecovery = asyncHandler(async (req, res) => {
  let userEmail = req.body.userEmail;

  console.log('Here is your data',userEmail)
  var options = {
    auth: {
        api_key: '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'
    }
}
var mailer = nodemailer.createTransport(sgTransport(options)); 
    
    try {
      if(!userEmail){
        res.json({isSuccessful: false, hasError: 'Please pass user email'});
      } else {
        console.log('I got here')
        let pool = await mssql.connect(sqlConfig);
        let userData = await pool.request().query(`select * from [dbo].[User_Personal] where Email_id = '${userEmail}'`);
        userData = userData.recordsets[0];
        console.log('See your user data:', userData)
        let dateObj = new Date();
        let month = dateObj.getUTCMonth() + 1; //months from 1-12
        let day = dateObj.getUTCDate();
        let year = dateObj.getUTCFullYear();
        let newdate = year + '-' + month + '-' +day;
        console.log('new date is:',newdate)
        let refNo = (Math.floor(Math.random() * 1000000) + 1) + newdate; 
        console.log(refNo);
        if(userData.length > 0){
          let result = await pool.request().query(`INSERT into [dbo].[PasswordRecovery](UserEmail, ReferenceNo) VALUES('${userEmail}','${refNo}')`);
          if(result){
            let messageTemp = await pool.request().query(`select * from [dbo].[MessageTemplates] where Title = 'Password'`); 
            let messageContent = messageTemp.recordset[0].Body;
            console.log('Here is your message:', messageContent)
            // replace("[[refNo]]", refNo).${userEmail}
            // <img alt="Everight logo" src="/logo.png" style="display: block; height: auto; border: 0; width: 325px; max-width: 100%;" title="Everight logo" width="325"/>
            let link = `selfservice.everightlab.com/reset-password/:${refNo}`;
            let name = userData[0].First_Name;
            let message = messageContent.replace("[link]", link).replace("[name]", name);
            console.log('Here is your message:', message, name)

            var email = {
            to: [userEmail],
            from: "philipmuyiwa@gmail.com",
            subject: messageTemp.recordset[0].Title,
            text: message,
            html: `<body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
            <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;" width="100%">
            <tbody>
            <tr>
            <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;" width="100%">
            <tbody>
            <tr>
            <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;" width="500">
            <tbody>
            <tr>
            <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
            <table border="0" cellpadding="0" cellspacing="0" class="image_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
            <tr>
            <td style="padding-bottom:10px;width:100%;padding-right:0px;padding-left:0px;">
            <div align="center" style="line-height:10px"><h4>Everight Lab</h4></div>
            </td>
            </tr>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;" width="100%">
            <tbody>
            <tr>
            <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;" width="500">
            <tbody>
            <tr>
            <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
            <table border="0" cellpadding="0" cellspacing="0" class="image_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
            <tr>
            <td style="width:100%;padding-right:0px;padding-left:0px;">
            </td>
            </tr>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;" width="100%">
            <tbody>
            <tr>
            <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 500px;" width="500">
            <tbody>
            <tr>
            <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
            <table border="0" cellpadding="0" cellspacing="0" class="image_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
            <tr>
            <!-- <td style="padding-bottom:5px;padding-left:5px;padding-right:5px;width:100%;">
            <div align="center" style="line-height:10px"><img alt="reset-password" src="images/pass-animate.gif" style="display: block; height: auto; border: 0; width: 350px; max-width: 100%;" title="reset-password" width="350"/></div>
            </td> -->
            </tr>
            </table>
            <table border="0" cellpadding="0" cellspacing="0" class="heading_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
            <tr>
            <td style="text-align:center;width:100%;">
            <span style="margin: 0; color: #393d47; direction: ltr; font-family: Tahoma, Verdana, Segoe, sans-serif; font-size: 25px; font-weight: normal; letter-spacing: normal; line-height: 100%; text-align: center; margin-top: 0; margin-bottom: 0;">There was a request to change your password!</span>
            </td>
            </tr>
            </table>
            <table border="0" cellpadding="10" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
            <tr>
            <td>
            <div style="font-family: Tahoma, Verdana, sans-serif">
            <div style="font-size: 12px; font-family: Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 18px; color: #393d47; line-height: 1.5;">
            <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;"><span style="">Please click this button to change your password</span></span></p>
            </div>
            </div>
            </td>
            </tr>
            </table>
            <table border="0" cellpadding="15" cellspacing="0" class="button_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
            <tr>
            <td>
            <div align="center">
            <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${link}" style="height:58px;width:257px;v-text-anchor:middle;" arcsize="35%" strokeweight="0.75pt" strokecolor="#07a7e3" fillcolor="#07a7e3"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#393d47; font-family:Tahoma, Verdana, sans-serif; font-size:18px"><![endif]--><a href="${link}" style="text-decoration:none;display:inline-block;color:#393d47;background-color:#07a7e3;border-radius:20px;width:auto;border-top:1px solid #07a7e3;border-right:1px solid #07a7e3;border-bottom:1px solid #07a7e3;border-left:1px solid #07a7e3;padding-top:10px;padding-bottom:10px;font-family:Tahoma, Verdana, Segoe, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;" target="_blank"><span style="padding-left:50px;padding-right:50px;font-size:18px;display:inline-block;letter-spacing:normal;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;"><span data-mce-style="font-size: 18px; line-height: 36px;" style="font-size: 18px; line-height: 36px;"><strong>RESET PASSWORD</strong></span></span></span></a>
            <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
            </div>
            </td>
            </tr>
            </table>
            <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
            <tr>
            <td style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:10px;">
            <div style="font-family: Tahoma, Verdana, sans-serif">
            <div style="font-size: 12px; font-family: Tahoma, Verdana, Segoe, sans-serif; text-align: center; mso-line-height-alt: 18px; color: #393d47; line-height: 1.5;">
            <p style="margin: 0; mso-line-height-alt: 19.5px;"><span style="font-size:13px;">If you didn’t request to change your password, simply ignore this email.</span></p>
            </div>
            </div>
            </td>
            </tr>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;" width="100%">
            <tbody>
            <tr>
            <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;" width="500">
            <tbody>
            <tr>
            <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
            <table border="0" cellpadding="15" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
            <tr>
            <td>
            </td>
            </tr>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table><!-- End -->
            </body>`,
              }
  
          mailer.sendMail(email, function(err, res) {
            if (err) { 
                console.log(err);
                res.json({isSuccessful: false, hasError: err})

            }
            else console.log('email sent to', userEmail);
          
          });
          res.json({isSuccessful: true, hasError: 'Message sent successfully'})
          }
          else {
            res.json({isSuccessful: false, hasError: 'User does not exist'}) 
          }
          
        } else {
          res.json({isSuccessful: failed, hasError: 'Something bad happened'}) 
        }

         
      } 
      
    } catch (error) {
      res.json({isSuccessful: false, hasError: 'Something bad happened'})
      console.log(error.message);
      mssql.close;
    }
  });

  const changePassword = asyncHandler(async (req, res) => {
    let userEmail = req.body.userEmail;
    let refNo = req.body.refNo;
    let password = req.body.password;
    let confpassword = req.body.confirmPassword;
    let pool = await mssql.connect(sqlConfig);   
    if(!userEmail || !refNo || !password || !confpassword){
      res.json({isSuccessful: false, hasError: 'Something happened, make sure you passed all the required fields'});
    } else if (password !== confpassword){
      res.json({isSuccessful: false, hasError: 'password does not match with confirm password'});
    } else {
      let confirmUser = await pool.request().query(`select * from [dbo].[PasswordRecovery] where ReferenceNo = '${refNo}' AND UserEmail = '${userEmail}'`); 
      let confirmUserVal =  confirmUser.recordsets[0];
      console.log('this is the user',confirmUserVal);
      if(confirmUserVal.length > 0){
        let updatePassword = await pool.request().query(`UPDATE [dbo].[User_Personal] SET Password = '${password}', Confirm_Pass = '${confpassword}' WHERE Email_id = '${userEmail}'`);
        if(updatePassword){
          console.log('this is me',updatePassword);
        mssql.close;
        res.json({isSuccessful: true, message: 'Success'});
        }
      } else {
        res.json({isSuccessful: false, hasError: 'User does not exist or incorrect reference number'});
      }
    }
      // res.json(record);
      // res.json({isSuccessful: true})
      // That's it. AT will then send your SMSs to your Simulators
      
    // })
  });

  
  export {sendMailNow, brithdaySMS, sendSMSNow, allTemplates, saveTemplate, singleTemplate, updateTemplate, celebrantsDayMail, passwordRecovery, changePassword};