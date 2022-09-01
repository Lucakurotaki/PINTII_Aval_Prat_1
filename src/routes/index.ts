import { Router } from "express";
import { roteadorAutent } from "./authRoutes";

const roteador = Router();

roteador.use("/auth", roteadorAutent);

export default roteador;