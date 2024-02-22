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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.getTodos = exports.updateTodo = exports.createTodo = exports.getUserById = exports.validUserById = exports.findUser = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createUser = (request) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = request;
    try {
        const user = yield prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password,
            },
        });
        return user;
    }
    catch (error) {
        throw error;
    }
});
exports.createUser = createUser;
const findUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findUnique({
            where: {
                email: email,
                password: password,
            },
        });
        return user;
    }
    catch (error) {
        throw error;
    }
});
exports.findUser = findUser;
const validUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findUnique({
            where: { id },
        });
        if (user) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (error) {
        throw error;
    }
});
exports.validUserById = validUserById;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findUnique({
            where: { id },
        });
        if (user) {
            return user;
        }
        else {
            return null;
        }
    }
    catch (error) {
        throw error;
    }
});
exports.getUserById = getUserById;
const createTodo = (request) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, done, userId } = request;
    try {
        const todo = yield prisma.todo.create({
            data: {
                title,
                description,
                done,
                userId,
            },
        });
        return todo;
    }
    catch (error) {
        throw error;
    }
});
exports.createTodo = createTodo;
const updateTodo = (request) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, updateTitle, updateDescription } = request;
    try {
        const todo = yield prisma.todo.update({
            where: {
                id: id,
            },
            data: {
                title: updateTitle,
                description: updateDescription,
            },
        });
        return todo;
    }
    catch (error) {
        throw error;
    }
});
exports.updateTodo = updateTodo;
const getTodos = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.todo.findMany({
            where: {
                userId: id,
            },
            select: {
                id: true,
                title: true,
                description: true,
                done: true,
            },
        });
        return user;
    }
    catch (error) {
        throw error;
    }
});
exports.getTodos = getTodos;
const deleteTodo = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todo = yield prisma.todo.delete({
            where: { id: id },
        });
        return todo;
    }
    catch (error) {
        throw error;
    }
});
exports.deleteTodo = deleteTodo;
