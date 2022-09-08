import { Router } from "express";
import { ControladorTelefone } from "../controllers/phoneController";
import { middlewareTelefone } from "../middlewares/phoneMiddleware";

const controladorTelefone = new ControladorTelefone();

const roteadorTelefone = Router();

roteadorTelefone.post("/cadastrar", controladorTelefone.cadastrarTelefone);
roteadorTelefone.post("/ativar", controladorTelefone.ativarTelefone);
roteadorTelefone.post("/entrar-requisicao", controladorTelefone.entrarRequisicao);
roteadorTelefone.post("/entrar-confirmacao", controladorTelefone.entrarConfirmacao);
roteadorTelefone.post("/alterar-requisicao", middlewareTelefone, controladorTelefone.alterarRequisicao);
roteadorTelefone.post("/alterar-confirmacao", middlewareTelefone, controladorTelefone.alterarConfirmacao);

export {roteadorTelefone};