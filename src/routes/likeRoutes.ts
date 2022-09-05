import { Router } from "express";
import { ControladorLike } from "../controllers/likeController";
import { middlewareAutoriz } from "../middlewares/authMiddleware";
import { middlewareTelefone } from "../middlewares/phoneMiddleware";

const roteadorLike = Router();
const controladorLike = new ControladorLike();

roteadorLike.use(middlewareAutoriz);

roteadorLike.post('/curtir', middlewareTelefone, controladorLike.curtir);
roteadorLike.get('/listar/:id', controladorLike.listar);
roteadorLike.post('/descurtir', middlewareTelefone, controladorLike.descurtir);

export {roteadorLike};