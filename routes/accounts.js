/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // router.get("/accounts", (req, res) => {
  //   res.render("accounts");
  // });

  router.get("/accounts", (req, res) => {
    userId = req.session.userID;
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
        console.log("templateVars", templateVars.accounts);
        res.render("accounts", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
