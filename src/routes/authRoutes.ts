import { Router } from "express";
import { ControladorAuth } from "../controllers/authController";
import { roteadorTelefone } from "./phoneRoutes";

const controladorAuth = new ControladorAuth();

const roteadorAuth = Router();

roteadorAuth.post("/cadastrar", controladorAuth.cadastrar);
roteadorAuth.post('/entrar', controladorAuth.entrar);
roteadorAuth.post('/ativar', controladorAuth.ativarConta);
roteadorAuth.post('/refresh', controladorAuth.refresh);

roteadorAuth.use('/telefone', roteadorTelefone);

export {roteadorAuth};