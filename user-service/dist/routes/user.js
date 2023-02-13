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
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const hashPassword_1 = __importDefault(require("../utils/hashPassword"));
const common_server_utils_1 = require("@kacperkruger/common-server-utils");
const router = express_1.default.Router();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        const hashedPassword = yield (0, hashPassword_1.default)(data.password);
        const createdUser = yield User_1.default.create({
            username: data.username,
            email: data.email,
            password: hashedPassword
        });
        return res.status(201).json({ createdUser });
    }
    catch (e) {
        const errorMessage = (0, common_server_utils_1.parseErrorMessage)(e);
        return res.status(400).send(errorMessage);
    }
}));
router.get('/details/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const user = yield User_1.default.findById(userId, '--password');
        console.log(user);
        if (user === null)
            return res.status(404).json({ error: 'User not found' });
        return res.json({ user });
    }
    catch (e) {
        const errorMessage = (0, common_server_utils_1.parseErrorMessage)(e);
        return res.status(400).send(errorMessage);
    }
}));
exports.default = router;
