import { Request, Response, NextFunction } from "express";
import { RepositoryToken } from "../repositories/tokenRepository";
import { ServiceToken } from "../services/tokenService";

export const middlewareAutoriz = async(req: Request, res: Response, next: NextFunction)=>{
    const autoriz = req.headers.authorization;

    if(!autoriz){
        return res.status(401).json({erro: "Credenciais não encontrados."});
    }

    const [tipoAutoriz, valorAutoriz] = autoriz.split(" ");

    const repositorioToken = new RepositoryToken();
    const serviceToken = new ServiceToken(repositorioToken);

    try{
        const tokenEmail = await serviceToken.verificarAccessToken(valorAutoriz);

        req.body.usuario_email = tokenEmail;

        return next();
    }catch(e){
        const erro = e as Error;
        return res.status(400).json({erro: erro.message});
    }
}