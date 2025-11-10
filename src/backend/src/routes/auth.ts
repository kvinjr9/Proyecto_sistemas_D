import { Router } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/register", async (req, res) => {
  const { nombre, ciudad, estado, correo, clave } = req.body;
  if (!nombre || !ciudad || !estado || !correo || !clave) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }

  const repo = AppDataSource.getRepository(User);
  const existing = await repo.findOneBy({ correo });
  if (existing)
    return res.status(409).json({ message: "Correo ya registrado" });

  const hash = await bcrypt.hash(clave, 10);
  const user = repo.create({ nombre, ciudad, estado, correo, clave: hash });
  await repo.save(user);
  return res.status(201).json({ message: "Registro exitoso" });
});

router.post("/login", async (req, res) => {
  const { correo, clave } = req.body;
  if (!correo || !clave)
    return res.status(400).json({ message: "Faltan credenciales" });

  const repo = AppDataSource.getRepository(User);
  const user = await repo.findOneBy({ correo });
  if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

  const match = await bcrypt.compare(clave, user.clave);
  if (!match)
    return res.status(401).json({ message: "Credenciales inválidas" });

  const secret = process.env.JWT_SECRET || "change_this_secret";
  const token = jwt.sign({ userId: user.id, correo: user.correo }, secret, {
    expiresIn: "8h",
  });

  return res.json({ token, message: "Login exitoso" });
});

export default router;
