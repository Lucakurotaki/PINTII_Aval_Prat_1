import { Router } from "express";
import { ControladorTelefone } from "../controllers/phoneController";

const controladorTelefone = new ControladorTelefone();

const roteadorTelefone = Router();

roteadorTelefone.post("/cadastrar", controladorTelefone.cadastrarTelefone);
roteadorTelefone.post("/ativar", controladorTelefone.ativarTelefone);
roteadorTelefone.post("/entrar-requisicao", controladorTelefone.entrarRequisicao);
roteadorTelefone.post("/entrar-confirmacao", controladorTelefone.entrarConfirmacao);

export {roteadorTelefone};