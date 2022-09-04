import { Router } from "express";
import { ControladorLeitura } from "../controllers/leituraController";
import { middlewareAutoriz } from "../middlewares/authMiddleware";

const controladorLeitura = new ControladorLeitura();

const roteadorLeitura = Router();

roteadorLeitura.use(middlewareAutoriz);

roteadorLeitura.get('/adicionar', controladorLeitura.adicionar);

export {roteadorLeitura};