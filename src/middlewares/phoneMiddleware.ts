import { NextFunction, Request, Response } from "express";
import { RepositoryUsuario } from "../repositories/userRepository";
import { ServiceUsuario } from "../services/userService";

export const middlewareTelefone = async(req: Request, res: Response, next: NextFunction)=>{
    const repositorioUsuario = new RepositoryUsuario();
    const serviceUsuario = new ServiceUsuario(repositorioUsuario);

    const usuario_email = req.body.usuario_email;

    try{
        const usuario = await serviceUsuario.buscarUsuario(usuario_email);

        console.log(usuario);

        if(usuario['usuario_telefone'] == undefined){
            throw new Error("Acesso negado. Ative o telefone.");
        }

        return next();
    }catch(e){
        const erro = e as Error;
        return res.status(400).json({erro: erro.message});
    }
}