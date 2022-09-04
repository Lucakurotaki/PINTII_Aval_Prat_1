import { Request, Response } from "express";
import { Leitura } from "../entities/leitura";
import { RepositoryLeitura } from "../repositories/leituraRepository";
import { RepositoryUsuario } from "../repositories/userRepository";
import { ServiceLeitura } from "../services/leituraService";
import { ServiceUsuario } from "../services/userService";

export class ControladorLeitura{
    public async adicionar(req: Request, res: Response): Promise<Response>{
        const repositorioLeitura = new RepositoryLeitura();
        const serviceLeitura = new ServiceLeitura(repositorioLeitura);

        const repositorioUsuario = new RepositoryUsuario();
        const serviceUsuario = new ServiceUsuario(repositorioUsuario);

        const {usuario_email, titulo, sub_titulo, tags} = req.body;

        try{
            const usuario = await serviceUsuario.encontrarUsuario(usuario_email);

            const usuario_id = usuario['usuario_id'];

            const leitura = {usuario_id, titulo, sub_titulo, tags} as Leitura;

            const lista = await serviceLeitura.adicionar(leitura);

            return res.status(201).json({ListaGeral: lista});

        }catch(e){
            const erro = e as Error;
            return res.status(400).json({erro: erro.message});
        }
    }
}