import { Router } from "express";
import { ControladorLeitura } from "../controllers/leituraController";
import { middlewareAutoriz } from "../middlewares/authMiddleware";

const controladorLeitura = new ControladorLeitura();

const roteadorLeitura = Router();

roteadorLeitura.use(middlewareAutoriz);

roteadorLeitura.post('/adicionar', controladorLeitura.adicionar);
roteadorLeitura.get('/listar-geral', controladorLeitura.listarGeral);
roteadorLeitura.get('/listar-usuario/:id', controladorLeitura.listarPorUsuario);

export {roteadorLeitura};