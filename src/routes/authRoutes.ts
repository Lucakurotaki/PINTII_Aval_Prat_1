import { Router } from "express";
import { ControladorAuth } from "../controllers/authController";

const controladorAuth = new ControladorAuth();

const roteadorAuth = Router();

roteadorAuth.post("/cadastrar", controladorAuth.cadastrar);
roteadorAuth.post('/entrar', controladorAuth.entrar);
roteadorAuth.post('/ativar', controladorAuth.ativarConta);
roteadorAuth.post('/refresh', controladorAuth.refresh);

roteadorAuth.post('/cadastrar-telefone', controladorAuth.cadastrarTelefone);
roteadorAuth.post('/ativar-telefone', controladorAuth.ativarTelefone);

export {roteadorAuth};