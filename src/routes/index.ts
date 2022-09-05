import { Router } from "express";
import { roteadorAuth } from "./authRoutes";
import { roteadorLeitura } from "./leituraRoutes";
import { roteadorAnotacao } from "./noteRoutes";

const roteador = Router();

roteador.use("/auth", roteadorAuth);
roteador.use("/leitura", roteadorLeitura);
roteador.use("/anotacao", roteadorAnotacao);

export default roteador;