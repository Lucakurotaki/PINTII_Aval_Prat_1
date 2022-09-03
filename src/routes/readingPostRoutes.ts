import { Router } from "express";
import { middlewareAutoriz } from "../middlewares/authMiddleware";

const roteadorLeitura = Router();

roteadorLeitura.use(middlewareAutoriz);

roteadorLeitura.get('/listar', (req, res) => {res.status(200).json({mensagem: "LISTAGEM"})});

export {roteadorLeitura};