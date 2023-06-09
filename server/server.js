require("dotenv").config();
const cors = require("cors");
const express = require("express");
const db = require("./db");
// morgan 3rd party middleware
//const morgan = require("morgan");
const app = express();

//cors middleware used for cross origin requests
app.use(cors());
// express middleware
app.use(express.json());

// Get all therapists
// returns number of rows in array
app.get("/api/v1/Therapists", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM therapist");
    console.log(results);
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        therapists: results.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Get a therapist (by id)
app.get("/api/v1/Therapists/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    // select * FROM therapist WHERE id = req.params.id;
    const results = await db.query("SELECT * FROM therapist WHERE id = $1", [
      req.params.id,
    ]);
    res.status(200).json({
      status: "success",
      data: {
        therapist: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Create therapist
app.post("/api/v1/Therapists", async (req, res) => {
  console.log(req.body);

  try {
    const results = await db.query(
      "INSERT INTO therapist (last_name, first_name, email, zip, address, bio, sliding_scale, cost) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) returning *",
      [
        req.body.last_name,
        req.body.first_name,
        req.body.email,
        req.body.zip,
        req.body.address,
        req.body.bio,
        req.sliding_scale,
        req.body.cost,
      ]
    );
    console.log(results);
    res.status(201).json({
      status: "success",
      data: {
        therapist: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Update therapist
// WHERE id = $1 because it is the primary key stored in the first row of the database
app.put("/api/v1/Therapists/:id", async (req, res) => {
  try {
    const results = await db.query(
      "UPDATE therapist SET last_name = $2, first_name = $3, email = $4, zip = $5, address = $6, bio = $7, sliding_scale = $8, cost = $9 WHERE id = $1 RETURNING *",
      [
        req.params.id,
        req.body.last_name,
        req.body.first_name,
        req.body.email,
        req.body.zip,
        req.body.address,
        req.body.bio,
        req.body.sliding_scale,
        req.body.cost,
      ]
    );
    console.log(results);
    res.status(200).json({
      status: "success",
      data: {
        therapist: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Delete therapist
app.delete("/api/v1/Therapists/:id", async (req, res) => {
  try {
    const results = await db.query("DELETE FROM therapist WHERE id = $1", [
        req.params.id
      ]);
    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    console.log(err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});