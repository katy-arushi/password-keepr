/* All routes for accounts are defined here
 * Since this file is loaded in server.js into api/accounts, these routes are mounted onto /accounts
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // -------------------------------------- GET ROUTE HANDLERS -------------------------------------- //

  // GET accounts
  router.get("/accounts", (req, res) => {  // renders HEADER partial
    const userId = req.session.userId; // userID from cookies

    const templateVars = {};

    db.query( // Query for displaying user's name in header
      `SELECT users.first_name AS name FROM users WHERE users.id = $1`,
      [userId]
      )
      .then((data) => {
        const userName = data.rows;
        templateVars.userName = userName; // add to template vars

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
            templateVars.accounts = accounts; // add to template vars
            console.log(templateVars);
            res.render("accounts", templateVars);
          })
          .catch((err) => {
            res.status(500).json({ error: err.message });
          });
      })

  });


  // GET new account
  router.get("/accounts/new_account", (req, res) => {  // renders HEADER partial
    const userId = req.session.userId; // userID from cookies
    const templateVars = {};

    db.query( // Query for displaying user's name in header
      `SELECT users.first_name AS name FROM users WHERE users.id = $1`,
      [userId]
      )
      .then((data) => {
        const userName = data.rows;
        templateVars.userName = userName; // add to template vars

        db.query(`SELECT * FROM categories`)
          .then((data) => {
            const categories = data.rows;
            templateVars.categories = categories; // add to template vars
            res.render("new_account", templateVars);
          })
          .catch((err) => {
            res.status(500).json({ error: err.message });
          });
      })
  });


  // GET generate password
  router.get("/accounts/generate_password", (req, res) => {  // renders HEADER partial
    const userId = req.session.userId;
    db.query( // Query for displaying user's name in header
      `SELECT users.first_name AS name FROM users WHERE users.id = $1`,
      [userId]
      )
      .then((data) => {
        const userName = data.rows;
        const templateVars = { userName }; // make template vars obj
        console.log(templateVars);
        res.render("generate_password", templateVars);
      })
  });


  // GET edit_password
  router.get("/accounts/:accountId", (req, res) => { // renders HEADER partial
    const accountId = req.params.accountId; // get accountID from the URL
    const userId = req.session.userId; // userID from cookies
    const templateVars = {id: userId};

    db.query( // Query for displaying user's name in header
      `SELECT users.first_name AS name FROM users WHERE users.id = $1`,
      [userId]
      )
      .then((data) => {
        const userName = data.rows;
        templateVars.userName = userName; // add to template vars

        db.query(`SELECT * FROM accounts WHERE id = $1`, [accountId])
          .then((data) => {
            const editedPassword = data.rows[0];
            templateVars.editedPassword = editedPassword; // add to template vars
            console.log(templateVars);
            res.render("edit_password", templateVars);
          })
          .catch((err) => {
            res.status(500).json({ error: err.message });
          });
      })

  });

  // ------------------------------------ POST ROUTE HANDLERS --------------------------------------- //

  // POST new account
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


  // POST generate password
  router.post("/accounts/generate_password", (req, res) => {
    res.redirect("/api/accounts/generate_password");
  });

  // POST delete an account
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


  // POST edit password
  router.post("/accounts/:accountId", (req, res) => {
    console.log("HERE", req.body);
    const accountId = req.params.accountId;
    const userOrg = req.session.orgName;
    const newPassword = req.body.manual_password;
    console.log(userOrg);
    console.log(accountId);

    db.query(
      `UPDATE accounts SET password = $1 WHERE id = $2 AND org_id = $3`,
      [newPassword, accountId, userOrg]
    )
      .then((data) => {
        const templateVars = {id: accountId}
        res.redirect("/api/accounts");
      })
      .catch((err) => {
        res.status(505).json({ error: err.message });
      });
  });

  return router;
};
