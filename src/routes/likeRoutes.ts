import { Router } from "express";
import { ControladorLike } from "../controllers/likeController";
import { middlewareAutoriz } from "../middlewares/authMiddleware";

const roteadorLike = Router();
const controladorLike = new ControladorLike();

roteadorLike.use(middlewareAutoriz);

roteadorLike.post('/curtir', controladorLike.curtir);
roteadorLike.get('/listar/:id', controladorLike.listar);
roteadorLike.post('/descurtir', controladorLike.descurtir);

export {roteadorLike};