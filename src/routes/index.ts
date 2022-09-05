import { Router } from "express";
import { roteadorAuth } from "./authRoutes";
import { roteadorLeitura } from "./leituraRoutes";
import { roteadorAnotacao } from "./noteRoutes";
import { roteadorLike } from "./likeRoutes";

const roteador = Router();

roteador.use("/auth", roteadorAuth);
roteador.use("/leitura", roteadorLeitura);
roteador.use("/anotacao", roteadorAnotacao);
roteador.use("/like", roteadorLike);

export default roteador;