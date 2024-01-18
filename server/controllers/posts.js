import Post from "../models/post.js";
import User from "../models/user.js";
import { cloudinary, storage } from "../cloudinary/index.js";


/* CREATE */
export const createPost = async (req, res) => {
    try {
        const { userId, description } = req.body;
        const picturePath = req.body.file;
        const user = await User.findById(userId);
        console.log("req.body.file -- picturepath:", picturePath);
        const b64 = Buffer.from(picturePath).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        console.log(`dataUrI -- ${dataURI}`);
        const pictureResult = await cloudinary.uploader.upload(dataURI, {
            resource_type: "auto",
            folder: "WaveApp",
        });
        console.log("picture-result", pictureResult);
        console.log("picturepath", pictureResult.secure_url);

        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath: pictureResult.secure_url,
            likes: {},
            comments: [],
        });
        await newPost.save();

        const post = await Post.find();
        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);
        console.log(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId });
        console.log(post);
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* UPDATE */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};