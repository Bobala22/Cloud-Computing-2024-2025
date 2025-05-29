import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from "../models/Admin.js";
import dotenv from 'dotenv';

dotenv.config();

const privateKey = process.env.PRIVATE_KEY_PATH.replace(/\\n/g, "\n");
const publicKey = process.env.PUBLIC_KEY_PATH.replace(/\\n/g, "\n");

export const register = async (req, res) => {
    const { username, fullName, password, email, role, carId } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "A user with this email already exists" });
        }

        const newUser = new User({
            username,
            fullName,
            password, 
            email, 
            role,
            carId
        });
        await newUser.save();

        const payload = {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            carId: newUser.carId
        };
        const token = jwt.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: process.env.JWT_EXPIRATION
        });

        res.status(200).json({ message: "Successfully registered.", token });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const registerAdmin = async (req, res) => {
    const { username, password, email, fullName, company, role } = req.body;
    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "A user with this email already exists" });
        }

        const newAdmin = new Admin({
            username,
            password,
            email,
            fullName,
            company,
            role
        });

        await newAdmin.save();

        const payload = {
            _id: newAdmin._id,
            username: newAdmin.username,
            email: newAdmin.email,
            role: newAdmin.role,
            company: newAdmin.company
        };
        const token = jwt.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: process.env.JWT_EXPIRATION
        });

        res.status(200).json({ message: "Successfully registered.", token });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const payload = {
            sub: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            carId: user.carId
        }

        const token = jwt.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: process.env.JWT_EXPIRATION
        })

        res.status(201).json({ token });
    } catch (error) {
        console.log("Login error", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await admin.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        const payload = {
            sub: admin._id,
            username: admin.username,
            email: admin.email,
            role: admin.role,
            company: admin.company
        }

        const token = jwt.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: process.env.JWT_EXPIRATION
        });

        res.status(201).json({ token });
    } catch (error) {
        console.log("Login error", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

