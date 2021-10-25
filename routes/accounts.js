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
        console.log("accounts", accounts);
        const templateVars = {
          accounts: accounts,
        };
        res.render("accounts", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  // GET new_account
  router.get("/accounts/new_account", (req, res) => {
    res.render("new_account");
  });

  router.post("/accounts/new_account", (req, res) => {
    const userOrg = req.session.userOrg;
    db.query(
      `INSERT INTO accounts (org_id, category_id, website_name, website_url, login, password)
    SELECT $1, id, $2, $3, $4, $5 FROM categories WHERE website_category=$6`,
      [
        userOrg,
        req.body.website_name,
        req.body.website_url,
        req.body.email,
        req.body.manual_password,
        req.body.category,
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
