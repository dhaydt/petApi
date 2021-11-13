const { Router } = require("express");
const db = require("../../config/db.js");
const router = Router();
const fs = require("fs");

// NEW GALLERIES

// find ID

router.get("/image/:id", (req, res) => {
  db.query(
    "SELECT * FROM galeri WHERE title = ?",
    [req.params.id],
    (err, rows) => {
      if (err) {
        res.send(err);
      } else {
        res.send({
          data: rows,
        });
      }
    }
  );
});

// UPDATE

const newGal = (req, res) => {
  console.log(req);
  if (!req.files) {
    var sql = `UPDATE galeri SET imgTitle = ?, imgDesc = ? WHERE id = ?;`;
    db.query(
      sql,
      [req.body.imgTitle, req.body.imgDesc, req.params.id],
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
    var post = req.body;
    var title = post.imgTitle;
    var desc = post.imgDesc;
    var id = req.params.id;

    var files = req.files.img;
    var name = Date.now() + files.name;

    db.query("SELECT * FROM galeri WHERE id = ?", [id], (err, row) => {
      if (err) {
        console.log(err);
      } else {
        var imgName = row[0].img;
      }
      console.log(imgName);

      const DIR_LEGAL = "public/images/newGaleri";
      const imgDir = DIR_LEGAL + "/" + imgName;
      if (fs.existsSync(imgDir)) {
        fs.unlinkSync(imgDir);
      }

      files.mv(`public/images/newGaleri/` + name, (err) => {
        if (err) return res.status(500).send(err);
        var sqlImg =
          "UPDATE galeri SET imgTitle = ?, imgDesc = ?, img = ? WHERE id = ?;";
        db.query(sqlImg, [title, desc, name, id], (err, rows) => {
          if (err) {
            res.send(err);
          } else {
            res.send(rows);
          }
        });
      });
    });
  }
};

router.put("/image/:id", newGal);

//----------------------------------------GALERI
// Del image
const DIR_LEGAL = "public/images/newGaleri";
router.delete("/image/:img", (req, res) => {
  if (!req.params.img) {
    console.log("No file received");
    var message = "Data img tidak diterima.";
  } else {
    console.log("file received");
    console.log(req.params.img);
    var sql = "DELETE FROM `galeri` WHERE `img`='" + req.params.img + "'";
    db.query(sql, function (err, result) {
      if (err) {
        return res.status(400).send(err);
      } else {
        const imgDir = DIR_LEGAL + "/" + req.params.img;
        if (fs.existsSync(imgDir)) {
          fs.unlinkSync(imgDir);
        }
        console.log("Berhasil menghapus legalitas");
        // return res.status(200).send("Successfully! Image has been Deleted");
        res.send({ data: result, message: message });
      }
    });
  }
});

// get legal
const get = (req, res) => {
  var message = "";
  var sql = "SELECT * FROM pet ORDER BY id DESC";
  db.query(sql, function (err, result) {
    // if (result.length <= 0) message = "Legalitas Kosong!";
    if (err) {
      return res.send(401);
    } else {
      return res.send({ data: result, message: message });
    }
  });
};

router.get("/pet", get);

// STORE IMG
const index = function (req, res) {
  if (req.method == "POST") {
    var post = req.body;

    var name = post.name;
    var breed = post.breed;
    var sex = post.sex;
    var age = post.age;
    var color = post.color;

    if (!req.files) return res.status(400).send("No files were uploaded.");
    // console.log(nilai);
    var face = req.files.face;
    var side = req.files.side;
    var top = req.files.top;
    var behind = req.files.behind;
    var barcode = req.files.barcode;

    var faceN = Date.now() + face.name;
    var sideN = Date.now() + side.name;
    var topN = Date.now() + top.name;
    var behindN = Date.now() + behind.name;
    var barcodeN = Date.now() + barcode.name;

    face.mv(`public/pet/` + faceN, (err) => {
      if (err)
        return res.status(500).send({ error: err, msg: "fail move face" });

      side.mv(`public/pet/` + sideN, (err) => {
        if (err)
          return res.status(500).send({ error: err, msg: "fail move Side" });
        top.mv(`public/pet/` + topN, (err) => {
          if (err)
            return res.status(500).send({ error: err, msg: "fail move top" });
          behind.mv(`public/pet/` + behindN, (err) => {
            if (err)
              return res
                .status(500)
                .send({ error: err, msg: "fail move behind" });

            barcode.mv(`public/pet/` + barcodeN, (err) => {
              if (err)
                return res.status
                  .send(500)
                  .send({ error: err, msg: "fail move barcode" });

              var sql =
                "INSERT INTO `pet`(`name`,`breed`,`sex`,`age`,`color`,`img-face`,`img-side`,`img-top`,`img-behind`,`barcode`) VALUES ('" +
                name +
                "','" +
                breed +
                "','" +
                sex +
                "','" +
                age +
                "','" +
                color +
                "','" +
                faceN +
                "','" +
                sideN +
                "','" +
                topN +
                "','" +
                behindN +
                "','" +
                barcodeN +
                "')";

              db.query(sql, (err, result) => {
                if (err) {
                  return res.status(400).send({
                    msg: err,
                  });
                }
                return res.status(201).send({
                  msg: "Data Saved",
                  data: result,
                });
              });
            });
          });
        });
      });
    });
  } else {
    res.send("Legalitas tersimpan");
  }
};

router.post("/pet", index);

module.exports = router;
