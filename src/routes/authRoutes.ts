import { Router } from "express";
import { ControladorAutent } from "../controllers/authController";

const controladorAutent = new ControladorAutent();

const roteadorAutent = Router();

roteadorAutent.post("/cadastrar", controladorAutent.cadastrar);
roteadorAutent.post('/entrar', controladorAutent.entrar);
roteadorAutent.post('/ativar', controladorAutent.ativar);
roteadorAutent.get('/refresh');

export {roteadorAutent};