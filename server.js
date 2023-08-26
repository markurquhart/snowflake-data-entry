require('dotenv').config();
const express = require('express');
const snowflake = require('snowflake-sdk');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;


// Express Middleware Configuration
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Snowflake Connection Configuration
const connection = snowflake.createConnection({
  account: process.env.SNOWFLAKE_ACCOUNT,
  username: process.env.SNOWFLAKE_USERNAME,
  password: process.env.SNOWFLAKE_PASSWORD,
  role: process.env.SNOWFLAKE_ROLE,
  warehouse: process.env.SNOWFLAKE_WAREHOUSE,
  database: process.env.SNOWFLAKE_DATABASE,
  schema: process.env.SNOWFLAKE_SCHEMA
});

// Snowflake Connection Error Handling
connection.connect((err) => {
  if (err) {
    console.error('Unable to connect to Snowflake:', err.message);
  } else {
    console.log('Successfully connected to Snowflake');
  }
});

// Setup Endpoints

// Get records from Snowflake
app.get('/records', (req, res) => {
  connection.execute({
    sqlText: 'SELECT * FROM MY_RECORDS',
    complete: (err, stmt, rows) => {
      if (err) {
        return res.status(400).send(err.message);
      }
      res.send(rows);
    }
  });
});

// Submit records to Snowflake
app.post('/submit', (req, res) => {
  const currentTime = new Date().toISOString();
  connection.execute({
    sqlText: 'INSERT INTO MY_RECORDS (name, email, LAST_UPDATED) VALUES (?, ?, ?)',
    binds: [req.body.name, req.body.email, currentTime],
    complete: (err) => {
      if (err) {
        return res.status(400).send(err.message);
      }
      res.send('Record inserted!');
    }
  });
});

// Update records in Snowflake
app.post('/update', (req, res) => {
  const { originalName, newName, newEmail } = req.body;
  const currentTime = new Date().toISOString();
  connection.execute({
    sqlText: 'UPDATE MY_RECORDS SET name = ?, email = ?, LAST_UPDATED = ? WHERE name = ?',
    binds: [newName, newEmail, currentTime, originalName],
    complete: (err) => {
      if (err) {
        return res.status(400).send(err.message);
      }
      res.send('Record updated!');
    }
  });
});

// Delete records in Snowflake
app.post('/delete', (req, res) => {
  const { name } = req.body;
  connection.execute({
    sqlText: 'DELETE FROM MY_RECORDS WHERE name = ?',
    binds: [name],
    complete: (err) => {
      if (err) {
        return res.status(400).send(err.message);
      }
      res.send('Record deleted!');
    }
  });
});

// Server Start
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
