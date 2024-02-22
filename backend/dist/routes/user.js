"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const zod_1 = __importDefault(require("zod"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getErrorMessage_1 = require("../utils/getErrorMessage");
const middleware_1 = require("../middleware");
exports.userRouter = express_1.default.Router();
const secretKey = process.env.JWT_SECRET;
const signUpSchema = zod_1.default.object({
    firstName: zod_1.default.string(),
    lastName: zod_1.default.string(),
    email: zod_1.default.string().email({ message: "Name cannot be empty" }),
    password: zod_1.default.string(),
});
const signInSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string(),
});
const requestHeader = zod_1.default.string();
exports.userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success } = signUpSchema.safeParse(req.body);
        if (!success) {
            return res.status(411).json({
                message: "Invalid Input",
            });
        }
        const { email } = req.body;
        const user = yield (0, db_1.findUser)(email);
        if (user) {
            return res.status(411).json({
                message: "Email already registerd",
            });
        }
        const dbResponse = yield (0, db_1.createUser)(req.body);
        const id = dbResponse.id.toString();
        const token = jsonwebtoken_1.default.sign({ id }, secretKey);
        return res.status(200).json({ token });
    }
    catch (error) {
        return res.status(411).send((0, getErrorMessage_1.getErrorMessage)(error));
    }
}));
exports.userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success } = signInSchema.safeParse(req.body);
        if (!success) {
            return res.status(411).json({
                message: "Invalid Input",
            });
        }
        const { email, password } = req.body;
        const user = yield (0, db_1.findUser)(email, password);
        if (!user) {
            return res.status(411).json({
                message: "User doesn't exist",
            });
        }
        if (!(password === user.password)) {
            return res.status(411).json({
                message: "Invalid password",
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, secretKey);
        return res.status(200).json({
            token,
        });
    }
    catch (error) {
        return res.status(411).send((0, getErrorMessage_1.getErrorMessage)(error));
    }
}));
exports.userRouter.post("/me", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success } = requestHeader.safeParse(req.body.token);
        if (!success) {
            return res.status(411).json({
                message: "Invalid Input",
            });
        }
        const token = req.body.token.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        if (decoded.id) {
            return res.json({
                validUser: true,
            });
        }
        res.json({
            validUser: false,
        });
    }
    catch (error) {
        return res.json({
            message: "Not valid request / Not Signin",
        });
    }
}));
exports.userRouter.get("/details", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.id;
        const user = yield (0, db_1.getUserById)(id);
        if (user) {
            return res.json({
                user,
            });
        }
        return res.status(411).json({
            message: "Something get wrong",
        });
    }
    catch (error) {
        return res.status(411).send((0, getErrorMessage_1.getErrorMessage)(error));
    }
}));
