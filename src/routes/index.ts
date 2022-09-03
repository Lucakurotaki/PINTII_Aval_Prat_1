import { Router } from "express";
import { roteadorAuth } from "./authRoutes";
import { roteadorLeitura } from "./readingPostRoutes";

const roteador = Router();

roteador.use("/auth", roteadorAuth);
roteador.use("/leitura", roteadorLeitura);

export default roteador;