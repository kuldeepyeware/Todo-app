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
exports.todoRouter = void 0;
const express_1 = __importDefault(require("express"));
const zod_1 = __importDefault(require("zod"));
const middleware_1 = require("../middleware");
const getErrorMessage_1 = require("../utils/getErrorMessage");
const db_1 = require("../db");
exports.todoRouter = express_1.default.Router();
const todoCreateSchema = zod_1.default.object({
    title: zod_1.default.string(),
    description: zod_1.default.string(),
    done: zod_1.default.boolean(),
});
const authIdSchema = zod_1.default.number();
const todoUpdateSchema = zod_1.default.object({
    id: zod_1.default.number(),
    updateTitle: zod_1.default.string().optional(),
    updateDescription: zod_1.default.string().optional(),
});
exports.todoRouter.post("/create", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success } = todoCreateSchema.safeParse(req.body);
        if (!success) {
            return res.status(411).json({
                message: "Invalid Input",
            });
        }
        const idSuccess = authIdSchema.safeParse(req.id);
        if (!idSuccess.success) {
            return res.status(411).json({
                message: "Invalid Authenticated Id",
            });
        }
        const userId = req.id;
        const todoValue = Object.assign(Object.assign({}, req.body), { userId });
        const todo = yield (0, db_1.createTodo)(todoValue);
        return res.status(200).json({
            todo,
        });
    }
    catch (error) {
        return res.status(411).send((0, getErrorMessage_1.getErrorMessage)(error));
    }
}));
exports.todoRouter.get("/gettodos", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success } = authIdSchema.safeParse(req.id);
        if (!success) {
            return res.status(411).json({
                message: "Invalid Authenticated Id",
            });
        }
        const id = req.id;
        const todos = yield (0, db_1.getTodos)(id);
        if (todos.length <= 0) {
            return res.status(200).json({
                todos: "Not Created Todos Yet",
            });
        }
        else {
            return res.status(200).json({
                todos,
            });
        }
    }
    catch (error) {
        return res.status(411).send((0, getErrorMessage_1.getErrorMessage)(error));
    }
}));
exports.todoRouter.put("/update", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success } = todoUpdateSchema.safeParse(req.body.data);
        if (!success) {
            return res.status(411).json({
                message: "Invalid Input",
            });
        }
        const todo = yield (0, db_1.updateTodo)(req.body.data);
        return res.status(200).json({
            todo,
        });
    }
    catch (error) {
        return res.status(411).send((0, getErrorMessage_1.getErrorMessage)(error));
    }
}));
exports.todoRouter.delete("/delete", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todo = yield (0, db_1.deleteTodo)(req.body.id);
        return res.status(200).json({
            todo,
        });
    }
    catch (error) {
        return res.status(411).send((0, getErrorMessage_1.getErrorMessage)(error));
    }
}));
