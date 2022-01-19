import asyncHandler from "express-async-handler";
import mssql from "mssql";
import moment from 'moment';
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

const allUsers = asyncHandler(async (req, res) => {
    try {
      let pool = await mssql.connect(sqlConfig);
      let result = await pool.request().query("select * from dbo.vwPatientDOBInfo");
      console.log(result);
      res.json(result);
      mssql.close;
    } catch (error) {
      console.log(error.message);
      mssql.close;
    }
  });

  const celebrants = asyncHandler(async (req, res) => {
    try {
      let pool = await mssql.connect(sqlConfig);
      let result = await pool.request().query(`SELECT * FROM [dbo].[vwPatientDOBInfo]
      WHERE DATEADD (YEAR, DATEPART(YEAR, GETDATE()) - DATEPART(YEAR, DateOfBirth), DateOfBirth)
      BETWEEN CAST(GETDATE() AS DATE) AND CAST(DATEADD(DAY, 1, GETDATE())-1 AS DATE)`);
      console.log(result);
      res.json(result);
      mssql.close;
    } catch (error) {
      console.log(error.message);
      mssql.close;
    }
  });


  const weeklycelebrants = asyncHandler(async (req, res) => {
    try {
      let pool = await mssql.connect(sqlConfig);
      let result = await pool.request().query(`SELECT * FROM [dbo].[vwPatientDOBInfo]
      WHERE DATEADD (YEAR, DATEPART(YEAR, GETDATE()) - DATEPART(YEAR, DateOfBirth), DateOfBirth)
      BETWEEN CAST(GETDATE() AS DATE) AND CAST(DATEADD(WEEK, 1, GETDATE())-1 AS DATE)`);
      console.log(result);
      res.json(result);
      mssql.close;
    } catch (error) {
      console.log(error.message);
      mssql.close;
    }
  });

  const monthlycelebrants = asyncHandler(async (req, res) => {
    try {
      let pool = await mssql.connect(sqlConfig);
      let result = await pool.request().query(`SELECT * FROM [dbo].[vwPatientDOBInfo]
      WHERE DATEADD (YEAR, DATEPART(YEAR, GETDATE()) - DATEPART(YEAR, DateOfBirth), DateOfBirth)
      BETWEEN CAST(GETDATE() AS DATE) AND CAST(DATEADD(MONTH, 1, GETDATE())-1 AS DATE)`);
      console.log(result);
      res.json(result);
      mssql.close;
    } catch (error) {
      console.log(error.message);
      mssql.close;
    }
  });

  const generatedUsers = asyncHandler(async (req, res) => {

    // WHERE DateOfBirth >= ${minAge} AND DateOfBirth <= ${maxAge} AND gender = ${gender} AND RegisteredOn > ${startDate} AND RegisteredOn < ${endDate}
    
    let minAge = req.query.minAge;
    let maxAge = req.query.maxAge;
    let gender = req.query.gender;
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    // let startDate = moment(new Date(req.query.startDate)).format('DD-MM-YYYY');;


    console.log('See it all:', minAge, maxAge, gender, startDate, endDate)

    let todaysDate = new Date();
    let minDOB = todaysDate.getFullYear() - minAge;
    let maxDOB = todaysDate.getFullYear() - maxAge;

    let newDate = new Date();
    let minYearOfBirth = new Date(newDate.setFullYear(minDOB));
    let maxYearOfBirth = new Date(newDate.setFullYear(maxDOB));

    minYearOfBirth = moment(new Date(req.query.startDate)).format('YYYY-MM-DD hh:mm:ss');
    maxYearOfBirth = moment(new Date(req.query.endDate)).format('YYYY-MM-DD hh:mm:ss');

    console.log('hjdcj',maxYearOfBirth, minYearOfBirth);

    // DateOfBirth > ${minYearOfBirth} AND DateOfBirth < ${maxYearOfBirth} AND Gender = ${gender} AND RegisteredOn > ${startDate} AND RegisteredOn < ${endDate}`

    try {
      let pool = await mssql.connect(sqlConfig);
      let paramVal = [];
      if(minAge){
        paramVal.push(minYearOfBirth);      }
      if(maxAge){
        paramVal.push(maxYearOfBirth);
      }
      if(gender){
        paramVal.push(gender);
      }
      if(startDate){
        paramVal.push(startDate);
      }
      if(endDate){
        paramVal.push(endDate);
      }
      let newVar = '';
      // DateOfBirth > '${minYearOfBirth}' AND DateOfBirth < '${maxYearOfBirth}' AND Gender = '${gender}' AND RegisteredOn > '${startDate}' AND RegisteredOn < '${endDate}'`);
      for(let i = 0; i<paramVal.length; i++){
        if( i == 0){
          if(paramVal[i] == minYearOfBirth){
            newVar = newVar + `DateOfBirth >= '${paramVal[i]}'`;
            }
            else if(paramVal[i] == maxYearOfBirth) {
              newVar = newVar + `DateOfBirth <= '${paramVal[i]}'`;
            }
            else if(paramVal[i] == gender) {
              newVar = newVar + `Gender >= '${paramVal[i]}'`;
            }
            else if(paramVal[i] == startDate) {
              newVar = newVar + `RegisteredOn >= '${paramVal[i]}'`;
            }
            else if(paramVal[i] == endDate) {
              newVar = newVar + `RegisteredOn <= '${paramVal[i]}'`;
        }

      } else {
        if(paramVal[i] == minYearOfBirth){
          newVar = newVar + ` AND DateOfBirth >= '${paramVal[i]}'`;
          }
          else if(paramVal[i] == maxYearOfBirth) {
            newVar = newVar + ` AND DateOfBirth <= '${paramVal[i]}'`;
          }
          else if(paramVal[i] == gender) {
            newVar = newVar + ` AND Gender >= '${paramVal[i]}'`;
          }
          else if(paramVal[i] == startDate) {
            newVar = newVar + ` AND RegisteredOn >= '${paramVal[i]}'`;
          }
          else if(paramVal[i] == endDate) {
            newVar = newVar + ` AND RegisteredOn <= '${paramVal[i]}'`;
      }
      }

      }
    
      let result = await pool.request().query(`SELECT * FROM [dbo].[vwPatientDOBInfo] where ${newVar}`);
      res.json(result);
      mssql.close;
      
    } catch (error) {
      console.log('See the error',error.message);
      mssql.close;
    }
  });

export {allUsers, celebrants, weeklycelebrants, monthlycelebrants, generatedUsers};