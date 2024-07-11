"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../Controllers/UserController");
const router = (0, express_1.Router)();
//User Router
router.post("/user", UserController_1.RegisterUser);
exports.default = router;
