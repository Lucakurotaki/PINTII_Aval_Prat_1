import { Router } from "express";
import { ControladorLeitura } from "../controllers/leituraController";
import { middlewareAutoriz } from "../middlewares/authMiddleware";

const controladorLeitura = new ControladorLeitura();

const roteadorLeitura = Router();

roteadorLeitura.use(middlewareAutoriz);

roteadorLeitura.post('/adicionar', controladorLeitura.adicionar);
roteadorLeitura.get('/listar-geral', controladorLeitura.listarGeral);
roteadorLeitura.get('/listar-usuario/:id', controladorLeitura.listarPorUsuario);
roteadorLeitura.post('/remover', controladorLeitura.remover);
roteadorLeitura.post('/definir-pagina', controladorLeitura.definirPagina);
roteadorLeitura.post('/definir-status', controladorLeitura.definirStatus);

export {roteadorLeitura};