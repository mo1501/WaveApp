import express from "express";
import { cloudinary } from './cloudinary/index.js';
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv/config";
import { fileURLToPath } from "url";

import { error } from "console";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/posts.js";
import { login, register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js"
import { verifyToken } from "./middleware/auth.js";


import User from "./models/user.js";
import Post from "./models/post.js";
//import { users, posts } from "./data/index.js";
/* CONFIGURATIONS */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: 'https://wave-app-frontend.vercel.app',
    methods: ["POST", "GET", "PATCH"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

//app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE */
const storage = multer.memoryStorage();
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(__dirname, 'public/assets'));
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
// });

const upload = multer({ storage });

app.get("/", (req, res) => {
    res.json({ message: "hello" });
});

/* ROUTES WITH FILES*/
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);
app.post("/auth/login", login);


/* ROUTES */
//app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);


/* MONGOOSE SETUP */

const PORT = process.env.PORT || 6001;
console.log(PORT);
mongoose.connect(process.env.MONGO_URL).then(() => {
    app.listen(PORT, () => console.log(`Server connected successfully on port: ${PORT}`));

    // User.insertMany(users);
    // Post.insertMany(posts);
}).catch((error) => console.log(`${error} did not connect`));
