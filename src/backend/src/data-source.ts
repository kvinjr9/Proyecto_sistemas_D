import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "./entity/User";

dotenv.config();

// Soporte dual: MySQL cuando está configurado, o SQLite para despliegues rápidos
const useMysql = !!process.env.DB_HOST;

export const AppDataSource = new DataSource(
  useMysql
    ? {
        type: "mysql",
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT || 3306),
        username: process.env.DB_USER || "appuser",
        password: process.env.DB_PASSWORD || "apppass",
        database: process.env.DB_NAME || "sistema_registro",
        entities: [User],
        synchronize: true, // solo para desarrollo / demo
        logging: false,
      }
    : {
        type: "sqlite",
        database: process.env.SQLITE_PATH || "./data.sqlite",
        entities: [User],
        synchronize: true,
        logging: false,
      }
);
