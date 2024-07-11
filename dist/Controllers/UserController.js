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
exports.RegisterUser = void 0;
// import prisma from "../dbConfig/dbConfig";
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: ['query']
});
const RegisterUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, FirstName, LastName, Password } = req.body;
        const checkUniqueUsername = yield prisma.user.findFirst({
            where: {
                userName: userName
            }
        });
        if (checkUniqueUsername) {
            return res.status(200).json({
                msg: "User Duplicate Data Found"
            });
        }
        const userData = yield prisma.user.create({
            data: {
                userName: userName,
                FirstName: FirstName,
                LastName: LastName,
                Password: Password,
            }
        });
        return res.status(200).json({
            data: userData,
            msg: "User Created Successfully."
        });
    }
    catch (error) {
        console.log(error);
        return res.status(404).json({
            msg: "Error Occurred",
            error: error
        });
    }
});
exports.RegisterUser = RegisterUser;
