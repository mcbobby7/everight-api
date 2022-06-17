// export const sqlConfig = {
//   user: "superdbuser",
//   password: "J@p@n123",
//   database: "hmsdb",
//   server: "mssql-35101-0.cloudclusters.net",
//   port: 35101,
//   pool: {
//     max: 10,
//     min: 0,
//     idleTimeoutMillis: 30000,
//   },
//   options: {
//     encrypt: true, // for azure
//     trustServerCertificate: true,
//   },
// };
export const sqlConfig = {
  user: "sa",
  password: "Welcome@1234",
  database: "hmsdb",
  server: `db-server\\sqlexpress`,
  port: 1433,
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
