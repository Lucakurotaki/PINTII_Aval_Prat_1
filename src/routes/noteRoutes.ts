import { Router } from "express";
import { ControladorAnotacao } from "../controllers/noteController";
import { middlewareAutoriz } from "../middlewares/authMiddleware";

const controladorAnotacao = new ControladorAnotacao();

const roteadorAnotacao = Router();

roteadorAnotacao.use(middlewareAutoriz);

roteadorAnotacao.post('/adicionar', controladorAnotacao.adicionar);
roteadorAnotacao.get('/listar/:id', controladorAnotacao.listar);
roteadorAnotacao.post('/remover', controladorAnotacao.remover);

export {roteadorAnotacao};