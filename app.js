import path from "path";
import express from "express";
import dotenv from "dotenv";
import mssql from "mssql";
import userRoute from "./routers/userRoute.js";
import sendNotifications from "./routers/sendNotifications.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.cjs";
import getReceipts from "./routers/lola_router.js";
import cors from "cors";
import fs from 'fs'
const app = express();

app.use(cors({
    origin: '*',
    // methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

dotenv.config();



app.use(express.json());
app.use("/api/Users", userRoute);
app.use("/api/Notifications", sendNotifications);

// app.use("/api/getit", getReceipts);
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// fs.readFile('C:\\Users\\Philip\\source\\repos\\LotusNotificationApp\\controllers\\missing_receipts.txt', 'utf8', async function(err, data) {
//   // res.writeHead(200, {'Content-Type': 'text/html'});
//   // res.write(data);
//   // return res.end();
//   console.log('hey',data.split('\r\n'))
//   console.log('aww',err)
//   let newVal = data.split('\r\n').map(col => `'${col}'`)

//   let pool = await mssql.connect(sqlConfig);
//   let updateReceipt = `UPDATE [dbo].[paymentreceipts] SET receipt_data = NULL, receipt_url = NULL WHERE PaytRef IN (${newVal.join(',')})`;
//   console.log(updateReceipt)
//         await pool.request().query(updateReceipt);
//         console.log(updateReceipt)
//         mssql.close;
//         // res.json({isSuccessful: true})
// });



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
mssql
  .connect(sqlConfig)
  .then((pool) => {
    console.log(pool);
    if (pool.connecting) {
      console.log("connecting");
    }
    if (pool.connected) {
      console.log("connected now!");
    }
    return pool;
  })
  .catch(function (err) {
    console.log("failed to open connection to database");
    console.log(err);
  });

mssql.on("error", (err) => {
  console.log(err.message);
});

const __dirname = path.resolve();
const PORT = process.env.PORT || 9200;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);