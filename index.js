const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fileUpload = require("express-fileupload");
const corsOptions = {
  // origin: "http://localhost:8080",
  // origin: "https://generasiunggul.com",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
// const fileURLToPath = require("url");
// Create express instance
const app = express();
// const dir = dirname(fileURLToPath());
// Require API routes
const users = require("./routes/users");

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

// Export express app
module.exports = app;

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3002;
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${port}`);
  });
}
