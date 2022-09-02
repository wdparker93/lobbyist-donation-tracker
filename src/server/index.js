const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "congressional_voting_schema",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/get/byUsState/:usState", (req, res) => {
  const usState = req.params.usState;
  const sqlSelect = `SELECT CSD.FIRST_NAME, CSD.LAST_NAME, CSD.PARTY, CSD.STATE, 
  SUM(CD.DONATION_AMOUNT) AS TOTAL_DOLLARS_RECEIVED FROM CONTRIBUTIONS_DATA CD
  JOIN CURRENT_SENATOR_DATA CSD ON CSD.SENATOR_KEY = CD.RECIPIENT_ID
  WHERE CD.RECIPIENT_NAME != ''
  AND CSD.STATE = ?
  GROUP BY CD.RECIPIENT_NAME
  ORDER BY TOTAL_DOLLARS_RECEIVED DESC`;
  db.query(sqlSelect, [usState], (err, result) => {
    res.send(result);
  });
});

app.get("/api/get/byParty/:party", (req, res) => {
  const party = req.params.party;
  const sqlSelect = `SELECT CSD.FIRST_NAME, CSD.LAST_NAME, CSD.PARTY, CSD.STATE, 
  SUM(CD.DONATION_AMOUNT) AS TOTAL_DOLLARS_RECEIVED FROM CONTRIBUTIONS_DATA CD
  JOIN CURRENT_SENATOR_DATA CSD ON CSD.SENATOR_KEY = CD.RECIPIENT_ID
  WHERE CD.RECIPIENT_NAME != ''
  AND CSD.PARTY = ?
  GROUP BY CD.RECIPIENT_NAME
  ORDER BY TOTAL_DOLLARS_RECEIVED DESC`;
  db.query(sqlSelect, [party], (err, result) => {
    res.send(result);
  });
});

app.get("/api/get/byStateParty/:usState/:party", (req, res) => {
  const party = req.params.party;
  const usState = req.params.usState;
  const sqlSelect = `SELECT CSD.FIRST_NAME, CSD.LAST_NAME, CSD.PARTY, CSD.STATE, 
  SUM(CD.DONATION_AMOUNT) AS TOTAL_DOLLARS_RECEIVED FROM CONTRIBUTIONS_DATA CD
  JOIN CURRENT_SENATOR_DATA CSD ON CSD.SENATOR_KEY = CD.RECIPIENT_ID
  WHERE CD.RECIPIENT_NAME != ''
  AND CSD.PARTY = ?
  AND CSD.STATE = ?
  GROUP BY CD.RECIPIENT_NAME
  ORDER BY TOTAL_DOLLARS_RECEIVED DESC`;
  db.query(sqlSelect, [party, usState], (err, result) => {
    res.send(result);
  });
});

app.listen(3001, () => {
  console.log("running on port 3001");
});
