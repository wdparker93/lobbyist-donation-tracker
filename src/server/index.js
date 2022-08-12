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

app.get("/api/get/:usState", (req, res) => {
  const usState = req.params.usState;
  //console.log(usState);
  const sqlSelect = `SELECT * FROM senator_list WHERE
  STATE = ?`;
  db.query(sqlSelect, [usState], (err, result) => {
    res.send(result);
  });
});

app.listen(3001, () => {
  console.log("running on port 3001");
});
