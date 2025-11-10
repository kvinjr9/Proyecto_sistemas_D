"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
router.post("/register", async (req, res) => {
    const { nombre, ciudad, estado, correo, clave } = req.body;
    if (!nombre || !ciudad || !estado || !correo || !clave) {
        return res
            .status(400)
            .json({ message: "Todos los campos son obligatorios" });
    }
    const repo = data_source_1.AppDataSource.getRepository(User_1.User);
    const existing = await repo.findOneBy({ correo });
    if (existing)
        return res.status(409).json({ message: "Correo ya registrado" });
    const hash = await bcryptjs_1.default.hash(clave, 10);
    const user = repo.create({ nombre, ciudad, estado, correo, clave: hash });
    await repo.save(user);
    return res.status(201).json({ message: "Registro exitoso" });
});
router.post("/login", async (req, res) => {
    const { correo, clave } = req.body;
    if (!correo || !clave)
        return res.status(400).json({ message: "Faltan credenciales" });
    const repo = data_source_1.AppDataSource.getRepository(User_1.User);
    const user = await repo.findOneBy({ correo });
    if (!user)
        return res.status(401).json({ message: "Credenciales inválidas" });
    const match = await bcryptjs_1.default.compare(clave, user.clave);
    if (!match)
        return res.status(401).json({ message: "Credenciales inválidas" });
    const secret = process.env.JWT_SECRET || "change_this_secret";
    const token = jsonwebtoken_1.default.sign({ userId: user.id, correo: user.correo }, secret, {
        expiresIn: "8h",
    });
    return res.json({ token, message: "Login exitoso" });
});
exports.default = router;
