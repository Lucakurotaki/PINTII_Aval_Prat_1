import { Request, Response, NextFunction } from "express";
import { RepositorioAutentToken } from "../repositories/tokenRepository";

export const middlewareAutent = async(req: Request, res: Response, next: NextFunction)=>{
    const autent = req.headers.authorization;

    if(!autent){
        return res.status(401).json({erro: "Credenciais não encontrados."});
    }

    const [tipoAutent, valorAutent] = autent.split(" ");

    const repositorioToken = new RepositorioAutentToken();

    try{
        const tokenEmail = await repositorioToken.verificarAccessToken(valorAutent);

        req.body.usuario_email = tokenEmail;

        return next();
    }catch(e){
        const erro = e as Error;
        return res.status(400).json({erro: erro.message});
    }
}