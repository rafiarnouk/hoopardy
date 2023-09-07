import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { UserModel } from "../models/Users.js"

const router = express.Router()

router.post("/register", async (req, res) => {
    const { username, password } = req.body

    const user = await UserModel.findOne({ username })

    if (user) {
        return res.json({ message: "user exists already" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new UserModel({ username, password: hashedPassword, players: [] })
    await newUser.save()

    res.json({ message: "registration successful" })
})

router.post("/login", async (req, res) => {
    const { username, password } = req.body

    const user = await UserModel.findOne({ username })

    if (!user) {
        return res.json({ message: "user does not exist" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.json({ message: "username or password is incorrect" })
    }

    const token = jwt.sign({ id: user._id }, "secret")
    res.json({ token, userID: user._id })
})

router.get("/players", async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "secret");
        const userId = decodedToken.id;

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const players = user.players;
        res.json(players);
    } catch (error) {
        res.status(401).json({ message: "unsuccessful" });
    }
});

router.post("/add-player", async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "secret");
        const userId = decodedToken.id;

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newPlayer = req.body.player;
        user.players.unshift(newPlayer);
        await user.save();

        res.json({ message: "player added" });
    } catch (error) {
        res.status(401).json({ message: "unsuccessful" });
    }
});

export { router as userRouter }