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
      VALUES ($1, $2, $3, $4) returning *`, // insert register form values into db
      [
        req.body.first_name, // these are the register form values to insert into db
        req.body.last_name,
        req.body.password,
        req.body.email,
      ]
    )
      .then((data) => {
        const user = data.rows[0]; // get the user, which is the first row of the results
        req.session.userId = user.id; // set the cookie to the user's id (the id which is autogenerated by psql)
        res.redirect("/organizations");
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: err.message });
      });
  });

  // GET login
  router.get("/login", (req, res) => {
    res.render("login");
  });

  // POST login
  router.post("/login", (req, res) => {
    const password = req.body.password; // get the password the user typed into the form
    const email = req.body.email; // get the email the user typed into the form
    if (!email || !password) { // if the user didn't enter a password, nor an email, error
      return res.status(403).send("Email or password cannot be empty");
    }

    db.query(`SELECT * FROM users WHERE email=$1`, [email]) // find the email in the db
      .then((data) => {
        user = data.rows[0]; // get the user, which is the first row of the results
        if (!user) { // check that a user exists
          res.send("Email login does not exist!");
        }
        if (password !== user.password) { // check password
          res.send("Incorrect Password!");
        }
        req.session.userId = user.id; // set cookies
        req.session.orgName = user.org_id; // set cookies
        res.redirect("/api/accounts");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // GET organizations

  router.get("/organizations", (req, res) => { // HEADER
    db.query(`SELECT * FROM organizations`) // show all organizations
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

  router.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
  });

  return router;
};
