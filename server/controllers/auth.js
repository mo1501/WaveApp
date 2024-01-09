import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js"
import { cloudinary, storage } from "../cloudinary/index.js";
import { Readable } from 'stream';
import streamifier from 'streamifier';


/* REGISTER USER */
export const register = async (req, res) => {
    console.log(` received req body -- ${JSON.stringify(req.file.buffer)}`);
    
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            friends,
            location,
            occupation,
        } = req.body;
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        console.log("req.file:", req.body.file);
        // Create a readable stream from the buffer
        const pictureStream = streamifier.createReadStream(req.file.buffer);

        const pictureResult = await cloudinary.uploader.upload(pictureStream,{
            upload_preset: 'ml_default',
        });
        console.log(`picture result file -- ${JSON.stringify(pictureResult)}`);
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath: pictureResult.secure_url,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: `Internal Server Error: ${error} ` });
    }
}

/* LOGGING IN */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User does not exist. " });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};