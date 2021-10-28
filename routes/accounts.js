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
      `SELECT accounts.*, categories.website_category AS category FROM accounts
    JOIN categories ON categories.id = accounts.category_id
    JOIN organizations ON organizations.id = accounts.org_id
    JOIN users ON users.org_id = organizations.id
    WHERE users.id = $1`,
      [userId]
    )
      .then((data) => {
        const accounts = data.rows;
        const templateVars = {
          accounts: accounts,
        };
        console.log(accounts);
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
    const userOrg = req.session.orgName;
    if (
      !req.body.website_name ||
      !req.body.website_url ||
      !req.body.email ||
      !req.body.manual_password
    ) {
      return res.status(505).send("Field cannot be blank");
    }
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

  router.get("/accounts/generate_password", (req, res) => {
    res.render("generate_password");
  });

  router.post("/accounts/generate_password", (req, res) => {
    res.redirect("/api/accounts/generate_password");
  });

  router.post("/accounts/:accountId/delete", (req, res) => {
    const accountId = req.params.accountId;
    const userOrg = req.session.orgName;

    db.query(`DELETE FROM accounts WHERE id = $1 AND org_id = $2`, [
      accountId,
      userOrg,
    ])
      .then((data) => {
        res.redirect("/api/accounts");
      })
      .catch((err) => {
        res.status(505).json({ error: err.message });
      });
  });

  // GET edit_password
  router.get("/accounts/:accountId", (req, res) => {
    const accountId = req.params.accountId;
    db.query(`SELECT * FROM accounts WHERE id = $1`, [accountId])
      .then((data) => {
        const templateVars = data.rows[0];
        res.render("edit_password", { templateVars });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/accounts/:accountId", (req, res) => {
    const accountId = req.params.accountId;
    const userOrg = req.session.orgName;
    const newPassword = req.body.manual_password;

    db.query(
      `UPDATE accounts SET password = $1 WHERE id = $2 AND org_id = $3`,
      [newPassword, accountId, userOrg]
    )
      .then((data) => {
        res.redirect("/api/accounts");
      })
      .catch((err) => {
        res.status(505).json({ error: err.message });
      });
  });

  return router;
};
