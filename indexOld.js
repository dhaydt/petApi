const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fileUpload = require("express-fileupload");
const corsOptions = {
  // origin: "http://localhost:8080",
  origin: "https://generasiunggul.com",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
// const fileURLToPath = require("url");
// Create express instance
const app = express();
// const dir = dirname(fileURLToPath());
// Require API routes
const users = require("./routes/users");
const test = require("./routes/test");
const auth = require("./routes/auth");
const visi = require("./routes/visi");
const legal = require("./routes/legal");
const liputan = require("./routes/liputan");
const cabang = require("./routes/cabang");
const image = require("./routes/image");
const pelatihan = require("./routes/pelatihan");
const testi = require("./routes/testimoni");
const loker = require("./routes/loker");
const apply = require("./routes/apply");
const kuis = require("./routes/kuis");
const struktur = require("./routes/struktur");
const timeline = require("./routes/timeline");
const instruktur = require("./routes/instruktur");
const kurikulum = require("./routes/kurikulum");
const kopdar = require("./routes/kopdar");
const notifikasi = require("./routes/notifikasi");

// PET
const pet = require("./routes/pet/pet");

app.use(bodyParser.json());
app.use(cors(corsOptions));

// UPLOAD
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());
// app.use(cors(corsOptions));
// Import API Routes
app.use(pet);

app.use(users);
app.use(test);
app.use(auth);
app.use(visi);
app.use(legal);
app.use(liputan);
app.use(cabang);
app.use(image);
app.use(pelatihan);
app.use(testi);
app.use(loker);
app.use(apply);
app.use(kuis);
app.use(struktur);
app.use(timeline);
app.use(instruktur);
app.use(kurikulum);
app.use(kopdar);
app.use(notifikasi);

// Export express app
module.exports = app;

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${port}`);
  });
}
