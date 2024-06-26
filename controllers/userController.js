import asyncHandler from "express-async-handler";
import mssql from "mssql";
import moment from "moment";
import { sqlConfig } from "../database.js";

const allUsers = asyncHandler(async (req, res) => {
  try {
    let pool = await mssql.connect(sqlConfig);
    let result = await pool
      .request()
      .query("select * from dbo.patient_registration");
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
    let result = await pool.request()
      .query(`SELECT * FROM [dbo].[patient_registration]
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
    let result = await pool.request()
      .query(`SELECT * FROM [dbo].[patient_registration]
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
    let result = await pool.request()
      .query(`SELECT * FROM [dbo].[patient_registration]
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
function replaceCharacters(str, num, year) {
  let newStr = str;
  let count = 0;
  for (const char of str) {
    newStr = newStr.replace(char, year[count]);
    count++;
    if (count == num) break;
  }
  return newStr;
}
const generatedUsers = asyncHandler(async (req, res) => {
  // WHERE DateOfBirth >= ${minAge} AND DateOfBirth <= ${maxAge} AND gender = ${gender} AND RegisteredOn > ${startDate} AND RegisteredOn < ${endDate}

  let minAge = req.query.minAge;
  let maxAge = req.query.maxAge;
  let gender = req.query.gender;
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  //   2022-06-30T00:00:00.000Z
  // let startDate = moment(new Date(req.query.startDate)).format('DD-MM-YYYY');;

  console.log("See it all:", minAge, maxAge, gender, startDate, endDate);

  let todaysDate = new Date();
  let minDOB = todaysDate.getFullYear() - maxAge;
  let maxDOB = todaysDate.getFullYear() - minAge;

  let minYearOfBirth = minDOB + "-01-01T00:00:00.000Z";
  let maxYearOfBirth = maxDOB + "-01-01T00:00:00.000Z";
  console.log("min", minYearOfBirth);
  console.log("max", maxYearOfBirth);

  console.log("hjdcj", maxYearOfBirth, minYearOfBirth);

  // DateOfBirth > ${minYearOfBirth} AND DateOfBirth < ${maxYearOfBirth} AND Gender = ${gender} AND RegisteredOn > ${startDate} AND RegisteredOn < ${endDate}`

  try {
    if (!minAge && !maxAge && !gender && !startDate && !endDate) {
      res.json({ isSuccessful: false, hasError: "No paramter passed" });
    } else {
      let pool = await mssql.connect(sqlConfig);
      let paramVal = [];
      if (minAge) {
        paramVal.push(minYearOfBirth);
      }
      if (maxAge) {
        paramVal.push(maxYearOfBirth);
      }
      if (gender) {
        paramVal.push(gender);
      }
      if (startDate) {
        paramVal.push(startDate);
      }
      if (endDate) {
        paramVal.push(endDate);
      }
      let newVar = "";
      // DateOfBirth > '${minYearOfBirth}' AND DateOfBirth < '${maxYearOfBirth}' AND Gender = '${gender}' AND RegisteredOn > '${startDate}' AND RegisteredOn < '${endDate}'`);
      for (let i = 0; i < paramVal.length; i++) {
        if (i == 0) {
          if (paramVal[i] == minYearOfBirth) {
            newVar = newVar + `date_of_birth >= '${paramVal[i]}'`;
          } else if (paramVal[i] == maxYearOfBirth) {
            newVar = newVar + `date_of_birth <= '${paramVal[i]}'`;
          } else if (paramVal[i] == gender) {
            newVar = newVar + `sex = '${paramVal[i]}'`;
          } else if (paramVal[i] == startDate) {
            newVar = newVar + `registration_date >= '${paramVal[i]}'`;
          } else if (paramVal[i] == endDate) {
            newVar = newVar + `registration_date <= '${paramVal[i]}'`;
          }
        } else {
          if (paramVal[i] == minYearOfBirth) {
            newVar = newVar + ` AND date_of_birth >= '${paramVal[i]}'`;
          } else if (paramVal[i] == maxYearOfBirth) {
            newVar = newVar + ` AND date_of_birth <= '${paramVal[i]}'`;
          } else if (paramVal[i] == gender) {
            newVar = newVar + ` AND sex = '${paramVal[i]}'`;
          } else if (paramVal[i] == startDate) {
            newVar = newVar + ` AND registration_date >= '${paramVal[i]}'`;
          } else if (paramVal[i] == endDate) {
            newVar = newVar + ` AND registration_date <= '${paramVal[i]}'`;
          }
        }
      }
      console.log("fetchdata", newVar);

      let result = await pool
        .request()
        .query(`SELECT * FROM [dbo].[patient_registration] where ${newVar}`);
      res.json(result);
      mssql.close;
    }
  } catch (error) {
    console.log("See the error", error.message);
    res.json({ recordset: [], hasError: true });

    mssql.close;
  }
});

export {
  allUsers,
  celebrants,
  weeklycelebrants,
  monthlycelebrants,
  generatedUsers,
};
