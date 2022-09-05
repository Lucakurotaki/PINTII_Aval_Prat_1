import { Request, Response } from "express";
import { Like } from "../entities/like";
import { RepositoryLeitura } from "../repositories/leituraRepository";
import { RepositoryLike } from "../repositories/likeRepository";
import { RepositoryUsuario } from "../repositories/userRepository";
import { ServiceLeitura } from "../services/leituraService";
import { ServiceLike } from "../services/likeService";
import { ServiceUsuario } from "../services/userService";

export class ControladorLike{
    public async curtir(req: Request, res: Response): Promise<Response>{
        const repositorioLeitura = new RepositoryLeitura();
        const serviceLeitura = new ServiceLeitura(repositorioLeitura);

        const repositorioLike = new RepositoryLike();
        const serviceLike = new ServiceLike(repositorioLike);

        const repositorioUsuario = new RepositoryUsuario();
        const serviceUsuario = new ServiceUsuario(repositorioUsuario);

        const {usuario_email, leitura_id} = req.body;

        try{
            const leitura = await serviceLeitura.buscarPorId(leitura_id);

            if(!leitura){
                throw new Error("Leitura não encontrada.")
            }

            const usuario = await serviceUsuario.buscarUsuario(usuario_email);

            const usuario_id = usuario['usuario_id'];

            if(usuario_id == leitura.usuario_id){
                throw new Error("Não é possível curtir a leitura própria.");
            }

            const like = {leitura_id, usuario_id} as Like;

            const likeId = await serviceLike.curtir(like);

            const likeAdicionado = await serviceLike.buscarPorId(likeId);

            return res.status(201).json({mensagem: `[${leitura.titulo}] curtida com sucesso.`, like: likeAdicionado});
        }catch(e){
            const erro = e as Error;
            return res.status(400).json({erro: erro.message});
        }
    }

    public async listar(req: Request, res: Response): Promise<Response>{
        const repositorioLike = new RepositoryLike();
        const serviceLike = new ServiceLike(repositorioLike);

        const repositorioLeitura = new RepositoryLeitura();
        const serviceLeitura = new ServiceLeitura(repositorioLeitura);

        const leitura_id = Number(req.params.id);

        try{
            const leitura = await serviceLeitura.buscarPorId(leitura_id);

            if(!leitura){
                throw new Error("Leitura não encontrada.");
            }

            const lista = await serviceLike.listar(leitura_id);

            return res.status(200).json({mensagem: `Likes da leitura [${leitura.titulo}] retornada com sucesso.`, lista})
        }catch(e){
            const erro = e as Error;
            return res.status(400).json({erro: erro.message});
        }
    }

    public async descurtir(req: Request, res: Response): Promise<Response>{
        const repositorioLeitura = new RepositoryLeitura();
        const serviceLeitura = new ServiceLeitura(repositorioLeitura);

        const repositorioLike = new RepositoryLike();
        const serviceLike = new ServiceLike(repositorioLike);

        const repositorioUsuario = new RepositoryUsuario();
        const serviceUsuario = new ServiceUsuario(repositorioUsuario);

        const {usuario_email, like_id} = req.body;

        try{
            const like = await serviceLike.buscarPorId(like_id);

            if(!like){
                throw new Error("Like não encontrado.");
            }

            const usuario = await serviceUsuario.buscarUsuario(usuario_email);

            const usuario_id = usuario['usuario_id'];

            if(usuario_id != like.usuario_id){
                throw new Error("Acesso negado.")
            }

            const leituraId = await serviceLike.descurtir(like_id);

            const leitura = await serviceLeitura.buscarPorId(leituraId);

            return res.status(200).json({message: `Leitura [${leitura.titulo}] descurtido com sucesso.`});
        }catch(e){
            const erro = e as Error;
            return res.status(400).json({erro: erro.message});
        }
    }
}