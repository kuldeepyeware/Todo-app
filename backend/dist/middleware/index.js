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
exports.authMiddleware = void 0;
const zod_1 = __importDefault(require("zod"));
const getErrorMessage_1 = require("../utils/getErrorMessage");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.JWT_SECRET;
const authorizationSchema = zod_1.default.string();
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success } = authorizationSchema.safeParse(req.headers.authorization);
        if (!success) {
            return res.status(411).json({
                message: "Invalid Header",
            });
        }
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(411).json({
                message: "Invalid Header",
            });
        }
        const token = authHeader.split(" ")[1];
        if (token == "null") {
            return res.status(411).json({
                message: "Invalid JWT",
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        if (!decoded.id) {
            return res.status(411).json({
                message: "Invalid token",
            });
        }
        let id = decoded.id;
        req.id = parseInt(id);
        // console.log(req.id + typeof req.id);
        next();
    }
    catch (error) {
        return res.status(411).send((0, getErrorMessage_1.getErrorMessage)(error));
    }
});
exports.authMiddleware = authMiddleware;
