/*
 * All routes for accounts are defined here
 * Since this file is loaded in server.js into api/accounts,
 *   these routes are mounted onto /accounts
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // GET accounts
  router.get("/accounts", (req, res) => {
    userId = req.session.userId;
    db.query(
      `SELECT accounts.* FROM accounts
    JOIN organizations ON organizations.id = org_id
    JOIN users ON organizations.id = users.org_id
    WHERE users.id=$1`,
      [userId]
    )
      .then((data) => {
        const accounts = data.rows;
        const templateVars = {
          accounts: accounts,
        };
        console.log("account", data.rows);
        res.render("accounts", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  // GET new_account
  router.get("/accounts/new_account", (req, res) => {
    db.query(`SELECT * FROM categories`)
      .then((data) => {
        const categories = data.rows;
        res.render("new_account", { categories });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/accounts/new_account", (req, res) => {
    const userOrg = req.session.userOrg;
    db.query(
      `INSERT INTO accounts (org_id, category_id, website_name, website_url, login, password) VALUES
      ($1, $2, $3, $4, $5, $6) returning *`,
      [
        userOrg,
        parseInt(req.body.category_id),
        req.body.website_name,
        req.body.website_url,
        req.body.email,
        req.body.manual_password,
      ]
    )
      .then((data) => {
        res.redirect("/api/accounts");
      })
      .catch((err) => {
        res.status(505).json({ error: err.message });
      });
  });

 // GET edit_password
 router.get("/accounts/edit_password", (req, res) => {
  res.render("edit_password");
});

router.post("/accounts/edit_password", (req, res) => {
  const userOrg = req.session.userOrg;

const newPassword = req.body.manual_password;

  db.query(
    `UPDATE accounts SET password = $1 WHERE id = $2`,
    [
      newPassword,
      '2',
    ]
  )
    .then((data) => {
      console.log(data.rows);
      res.redirect("/api/accounts");
    })
    .catch((err) => {
      res.status(505).json({ error: err.message });
    });
});
  return router;
};

