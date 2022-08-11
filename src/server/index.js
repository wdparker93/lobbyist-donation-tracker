const express = require("express");
const app = express();
const mysql = require("mysql");

const insertString = `INSERT INTO senator_list (
    SEN_FIRST_NAME, 
    SEN_LAST_NAME,
    STATE,
    POLITICAL_PARTY,
    SEN_START_YEAR,
    SEN_END_YEAR,
    CURRENTLY_SERVING)
    VALUES (
        'William',
        'Parker',
        'AL',
        'Democrat',
        2020,
        2021,
        'N'
        );`;

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "congressional_voting_schema",
});

app.get("/api/select", (req, res) => {
  const sqlSelect = `SELECT * FROM senator_list WHERE
  SEN_FIRST_NAME = `;
  db.query();
});

app.listen(3001, () => {
  console.log("running on port 3001");
});
