require("dotenv/config");
const express = require("express");
const cors = require("cors");
const bearer = require("express-bearer-token")
const { join } = require("path");

const PORT = process.env.PORT || 8000;
const app = express();
app.use(cors())
app.use(bearer())
app.use(
  cors({
    origin: [process.env.WHITELISTED_DOMAIN && process.env.WHITELISTED_DOMAIN.split(",")],
  })
);

app.use(express.json());

//#region API ROUTES

// ===========================
// NOTE : Add your routes here
const { userRouter, categoryRouter } = require("./router");
const { dbSequelize } = require("./config/db");
app.use("/api", userRouter);
app.use("/api", categoryRouter);

// ===========================

// not found
app.use((req, res, next) => {
  if (req.path.includes("/api/")) {
    res.status(404).send("Not found !");
  } else {
    next();
  }
});

// error
app.use((err, req, res, next) => {
  if (req.path.includes("/api/")) {
    console.error("Error : ", err.stack);
    res.status(500).send("Error !");
  } else {
    next();
  }
});

//#endregion

//#region CLIENT
const clientPath = "../../client/build";
app.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, clientPath, "index.html"));
});

//#endregion

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});

dbSequelize.sync();
