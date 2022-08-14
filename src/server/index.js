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
  const sqlSelect = `SELECT * FROM current_senator_data WHERE
  STATE = ?`;
  db.query(sqlSelect, [usState], (err, result) => {
    res.send(result);
  });
});

app.get("/api/get/byParty/:party", (req, res) => {
  const party = req.params.party;
  const sqlSelect = `SELECT * FROM current_senator_data WHERE
  PARTY = ?`;
  db.query(sqlSelect, [party], (err, result) => {
    res.send(result);
  });
});

app.listen(3001, () => {
  console.log("running on port 3001");
});
