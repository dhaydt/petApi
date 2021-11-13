const { Router } = require("express");
const db = require("../config/db.js");
const router = Router();

const update = (req, res) => {
  console.log(req);
  var sql = `UPDATE visi SET visi = ?, misi = ? WHERE id = ?;`;
  db.query(
    sql,
    [req.body.visi, req.body.misi, req.params.id],
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
};

router.put("/visi/:id", update);

router.post("/visi", (req, res) => {
  db.query(
    `INSERT INTO visi (visi, misi) VALUES (${db.escape(
      req.body.visi
    )}, ${db.escape(req.body.misi)})`,
    (err, result) => {
      if (err) {
        return res.status(400).send({
          msg: err,
        });
      }
      return res.status(201).send({
        msg: "Visi / Misi tersimpan",
        data: result,
      });
    }
  );
});

router.get("/visi", (req, res) => {
  db.query(
    "SELECT * FROM visi WHERE misi IS NOT NULL ORDER BY id desc",
    (err, rows) => {
      if (err) {
        return res.status(400).send({
          msg: "Database error",
        });
      } else {
        //render ke view posts index
        return res.status(200).send({
          data: rows, // <-- data posts
        });
      }
    }
  );
});

router.get("/visiOnly", (req, res) => {
  var sql = "SELECT * FROM visi WHERE visi IS NOT NULL  ORDER BY id desc";
  db.query(sql, (err, rows) => {
    if (err) {
      return res.status(400).send({
        msg: "Database error",
      });
    } else {
      //render ke view posts index
      return res.status(200).send({
        data: rows, // <-- data posts
      });
    }
  });
});

router.delete("/visi/:id", (req, res) => {
  db.query(`DELETE FROM visi WHERE visi.id = ${req.params.id}`, function(
    err,
    result
  ) {
    if (err) {
      return res.status(401).send({
        msg: "Fail to delete",
      });
    } else {
      return res.status(200).send({
        msg: "Data deleted",
        data: result,
      });
    }
  });
});

module.exports = router;
