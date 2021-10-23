/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/organizations", (req, res) => {
    res.render("organizations");
  });

  router.get("/register", (req, res) => {
    res.render("register");
  });

  router.post("/register", (req, res) => {
    db.query(
      `INSERT INTO users (org_id, first_name, last_name, password, email)
    VALUES ($1, $2, $3, $4, $5) returning *`,
      [
        "1",
        req.body.first_name,
        req.body.last_name,
        req.body.password,
        req.body.email,
      ]
    )
      .then((data) => {
        const user = data.rows[0];
        req.session.userId = user.id;
        res.redirect("/organizations");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message }); // Add comment
      });
  });

  router.get("/login", (req, res) => {
    res.render("login");
  });

  router.post("/login", (req, res) => {
    const password = req.body.password;
    const email = req.body.email;
    db.query(`SELECT * FROM users WHERE email=$1`, [email])
      .then((data) => {
        user = data.rows[0];
        req.session.userID = user.id;
        res.redirect("/api/accounts");
      })
      .catch((err) => {
        res.status(500).jason({ error: err.message });
      });
  });

  return router;
};
