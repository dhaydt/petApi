const { Router } = require("express");
const db = require("../config/db.js");
const bcrypt = require("bcryptjs");
const router = Router();
const jwt = require("jsonwebtoken");
const userMiddleware = require("../middleware/users.js");

router.post("/register", userMiddleware.validateRegister, (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE LOWER(email) = LOWER(?)`,
    [req.body.email],
    (err, result) => {
      if (result.length) {
        return res.status(409).send({
          msg: "This email already in use",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              msg: err,
            });
          } else {
            db.query(
              `INSERT INTO users (name , email, password) VALUES (?, ?, ?)`,
              [req.body.name, req.body.email, hash],
              (err, row) => {
                if (err) {
                  return res.status(400).send({
                    msg: err,
                  });
                } else {
                  return res.status(201).send({
                    msg: "Registered Successfully",
                  });
                }
              }
            );
          }
        });
      }
    }
  );
});

router.post("/login", (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE email = ?`,
    [req.body.email],
    (err, result) => {
      if (err) {
        return res.status(400).send({
          msg: err,
        });
      } else if (!result.length) {
        return res.status(401).send({
          msg: "Email or Password is Incorrect!",
        });
      } else {
        bcrypt.compare(
          req.body.password,
          result[0]["password"],
          (bErr, bResult) => {
            if (bErr) {
              return res.status(401).send({
                msg: "Username or password is Incorrect!",
              });
            }

            if (bResult) {
              const token = jwt.sign(
                {
                  email: result[0].email,
                  userId: result[0].id,
                },
                "SECRETKEY",
                {
                  expiresIn: "7d",
                }
              );

              return res.status(200).send({
                msg: "Logged in!",
                token,
                user: result[0],
              });
            } else {
              return res.status(401).send({
                msg: "Username or password is incorrect!",
              });
            }
          }
        );
      }
    }
  );
});

//
//
//
//
//
//
//
//
//
//

router.delete("/users/:id", (req, res) => {
  db.query(`DELETE FROM users WHERE id = ?`, [req.params.id], (err, result) => {
    if (err) {
      return res.status(401).send({
        msg: err,
      });
    } else {
      return res.status(200).send({
        msg: "Data deleted",
        data: result,
      });
    }
  });
});

const update = (req, res) => {
  console.log(req);
  if (!req.body.new_password) {
    var sql = `UPDATE users SET nama_depan = ?, nama_bel = ?, email = ?, telp = ?, alamat = ?, role = ? WHERE id = ?;`;
    db.query(
      sql,
      [
        req.body.nama_depan,
        req.body.nama_bel,
        req.body.email,
        req.body.telp,
        req.body.alamat,
        req.body.role,
        req.params.id,
      ],
      (err, result) => {
        if (err) {
          return res.status(400).send({
            msg: err,
          });
        }
        return res.status(201).send({
          msg: "Legalitas tersimpan",
          data: result,
        });
      }
    );
  } else {
    bcrypt.hash(req.body.new_password, 10, (err, hash) => {
      if (err) {
        return res.status(500).send({
          msg: err,
        });
      } else {
        // has hashed pw => add to database
        var s = `UPDATE users SET nama_depan = ?, nama_bel = ?, email = ?, telp = ?, alamat = ?, role = ?, password = ? WHERE id = ?;`;
        db.query(
          s,
          [
            req.body.nama_depan,
            req.body.nama_bel,
            req.body.email,
            req.body.telp,
            req.body.alamat,
            req.body.role,
            hash,
            req.params.id,
          ],
          (err, result) => {
            if (err) {
              return res.status(400).send({
                msg: err,
              });
            }
            return res.status(201).send({
              msg: "Changed",
            });
          }
        );
      }
    });
  }
};

router.put("/users/:id", update);

router.get("/users", (req, res) => {
  db.query("SELECT * FROM users ORDER BY id desc", (err, rows) => {
    if (err) {
      return res.status(400).send({
        msg: err,
      });
    } else {
      //render ke view posts index
      return res.status(200).send({
        data: rows, // <-- data posts
      });
    }
  });
});

module.exports = router;
