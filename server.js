// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

// -------------------------------------- GET ROUTE HANDLERS -------------------------------------- //

app.get("/", (req, res) => {
  res.render("homepage");
});

app.get("/api/users", (req, res) => {
  db.query(`SELECT * FROM users;`)
    .then((data) => {
      const users = data.rows;
      res.json({ users });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/accounts", (req, res) => {
  res.render("accounts");
});

// ------------------------------------ POST ROUTE HANDLERS --------------------------------------- //

app.post("/register", (req, res) => {
  res.redirect('/accounts');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
