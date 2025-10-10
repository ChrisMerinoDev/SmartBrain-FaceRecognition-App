import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import knex from "knex";
import handleRegister from "./controllers/register.js";
import handleSignIn from "./controllers/signin.js";
import getProfile from "./controllers/getProfile.js";
import imageEntries from "./controllers/imageEntries.js";
import router from "./clarifaiAPI/clarifaiAPI.js";

// knex module
const DB = knex({ // DB - stands as DataBase
    client: 'pg',
    connection: process.env.DATABASE_URL,
  });

const PORT = process.env.PORT
const FRONTEND_URL =process.env.FRONTEND_URL

const app = express();
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use("/api/clarifai", router);

app.get("/", (_request, response) => response.send("OK"))

app.listen(PORT, () => {
    console.log(`app server is running on port: ${PORT}`)
})

// sign in
app.post("/signin", (req, res) => { handleSignIn(req, res, DB, bcrypt) })

// register
app.post("/register", async(req, res) => { handleRegister(req, res, DB, bcrypt) })

// get user by ID
app.get("/profile/:id", (req, res) => { getProfile(req, res, DB) })

// image --> PUT 
app.put("/api/image", (req, res) => { imageEntries(req, res, DB) })