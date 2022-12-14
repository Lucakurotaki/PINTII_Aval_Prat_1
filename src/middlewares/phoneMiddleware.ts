import { NextFunction, Request, Response } from "express";
import { RepositoryUsuario } from "../repositories/userRepository";
import { ServiceUsuario } from "../services/userService";

export const middlewareTelefone = async(req: Request, res: Response, next: NextFunction)=>{
    const repositorioUsuario = new RepositoryUsuario();
    const serviceUsuario = new ServiceUsuario(repositorioUsuario);

    const telefone = req.body.telefone;

    try{
        const usuario = await serviceUsuario.buscarPorTelefone(telefone);

        if(usuario == undefined){
            throw new Error("Acesso negado. Ative o telefone.");
        }

        return next();
    }catch(e){
        const erro = e as Error;
        return res.status(400).json({erro: erro.message});
    }
}