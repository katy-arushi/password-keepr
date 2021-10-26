/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // GET register
  router.get("/register", (req, res) => {
    res.render("register");
  });

  // POST register
  router.post("/register", (req, res) => {
    db.query(
      `INSERT INTO users (first_name, last_name, password, email)
      VALUES ($1, $2, $3, $4) returning *`,
      [
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
        console.error(err);
        res.status(500).json({ error: err.message }); // Add comment
      });
  });

  // GET login
  router.get("/login", (req, res) => {
    res.render("login");
  });

  // POST login
  router.post("/login", (req, res) => {
    const password = req.body.password;
    const email = req.body.email;
    db.query(`SELECT * FROM users WHERE email=$1`, [email])
      .then((data) => {
        user = data.rows[0];
        req.session.userId = user.id;
        req.session.orgName = user.org_id;
        res.redirect("/api/accounts");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // GET organizations
  router.get("/organizations", (req, res) => {
    db.query(`SELECT * FROM organizations`)
      .then((data) => {
        const organizations = data.rows;
        res.render("organizations", { organizations });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/organizations", (req, res) => {
    const userId = req.session.userId;
    const orgName = req.body.org_name;
    db.query(`UPDATE users SET org_id = $1 WHERE id = $2 returning *`, [
      orgName,
      userId,
    ])
      .then((data) => {
        const organization = data.rows[0];
        req.session.orgName = organization.org_id;
        res.redirect("/api/accounts");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
