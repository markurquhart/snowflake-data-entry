require('dotenv').config();

const express = require('express');
const snowflake = require('snowflake-sdk');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Snowflake Connection Configuration
var connection = snowflake.createConnection({
  account: process.env.SNOWFLAKE_ACCOUNT,
  username: process.env.SNOWFLAKE_USERNAME,
  password: process.env.SNOWFLAKE_PASSWORD,
  role: process.env.SNOWFLAKE_ROLE,
  warehouse: process.env.SNOWFLAKE_WAREHOUSE,
  database: process.env.SNOWFLAKE_DATABASE,
  schema: process.env.SNOWFLAKE_SCHEMA
});

connection.connect((err, conn) => {
  if (err) {
    console.error('Unable to connect: ' + err.message);
  } else {
    console.log('Successfully connected to Snowflake');
  }
});

// Endpoint to Get Records
app.get('/records', (req, res) => {
  connection.execute({
    sqlText: 'SELECT * FROM MY_RECORDS',
    complete: (err, stmt, rows) => {
      if (err) {
        console.error(`Failed to execute statement: ${err}`);
        res.status(400).send(err);
      } else {
        res.send(rows);
      }
    }
  });
});

// Endpoint to Submit Records
app.post('/submit', (req, res) => {
  const currentTime = new Date().toISOString();
connection.execute({
    sqlText: `INSERT INTO MY_RECORDS (name, email, LAST_UPDATED) VALUES (?, ?, ?)`,
    binds: [req.body.name, req.body.email, currentTime],
    complete: (err, stmt, rows) => {
      if (err) {
        console.error(`Failed to execute statement: ${err}`);
        res.status(400).send(err);
      } else {
        res.send('Record inserted!');
      }
    }
  });
});


// Endpoint to Update Records
app.post('/update', (req, res) => {
  const { originalName, newName, newEmail } = req.body;
  const currentTime = new Date().toISOString();
connection.execute({
    sqlText: `UPDATE MY_RECORDS SET name = ?, email = ?, LAST_UPDATED = ? WHERE name = ?`,
    binds: [newName, newEmail, currentTime, originalName],
      complete: (err, stmt, rows) => {
          if (err) {
              console.error(`Failed to execute statement: ${err}`);
              res.status(400).send(err);
          } else {
              res.send('Record updated!');
          }
      }
  });
});


// Endpoint to Delete Records
app.post('/delete', (req, res) => {
  const { name } = req.body;

  connection.execute({
      sqlText: `DELETE FROM MY_RECORDS WHERE name = ?`,
      binds: [name],
      complete: (err, stmt, rows) => {
          if (err) {
              console.error(`Failed to execute statement: ${err}`);
              res.status(400).send(err);
          } else {
              res.send('Record deleted!');
          }
      }
  });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
