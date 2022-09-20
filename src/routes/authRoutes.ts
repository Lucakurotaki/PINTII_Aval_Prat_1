import { Router } from "express";
import { ControladorAuth } from "../controllers/authController";
import { signupCelebrate } from "../middlewares/signupCelebrate";
import { roteadorTelefone } from "./phoneRoutes";

const controladorAuth = new ControladorAuth();

const roteadorAuth = Router();

roteadorAuth.post("/cadastrar", signupCelebrate, controladorAuth.cadastrar);
roteadorAuth.post('/entrar', controladorAuth.entrar);
roteadorAuth.post('/ativar', controladorAuth.ativarConta);
roteadorAuth.post('/refresh', controladorAuth.refresh);
roteadorAuth.post('/gerar-codigo', controladorAuth.gerarCodigoAtivacao);

roteadorAuth.use('/telefone', roteadorTelefone);


export {roteadorAuth};