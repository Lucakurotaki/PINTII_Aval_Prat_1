import { Anotacao } from "../entities/note";
import { Request, Response } from "express";
import { RepositoryLeitura } from "../repositories/leituraRepository";
import { RepositoryAnotacao } from "../repositories/noteRepository";
import { RepositoryUsuario } from "../repositories/userRepository";
import { ServiceLeitura } from "../services/leituraService";
import { ServiceAnotacao } from "../services/noteService";
import { ServiceUsuario } from "../services/userService";

export class ControladorAnotacao{
    public async adicionar(req: Request, res: Response): Promise<Response>{
        const repositorioAnotacao = new RepositoryAnotacao();
        const serviceAnotacao = new ServiceAnotacao(repositorioAnotacao);
        
        const repositorioLeitura = new RepositoryLeitura();
        const serviceLeitura = new ServiceLeitura(repositorioLeitura);

        const repositorioUsuario = new RepositoryUsuario();
        const serviceUsuario = new ServiceUsuario(repositorioUsuario);

        const {usuario_email, leitura_id, texto} = req.body;

        try{
            const leitura = await serviceLeitura.buscarPorId(leitura_id);

            if(!leitura){
                throw new Error("Leitura não encontrada.");
            }

            const usuario = await serviceUsuario.buscarUsuario(usuario_email);

            const usuario_id = usuario.usuario_id;

            if(usuario_id != leitura.usuario_id){
                throw new Error("Acesso negado.");
            }

            const anotacao = {usuario_id, leitura_id, texto} as Anotacao;

            const anotacaoId = await serviceAnotacao.adicionar(anotacao);

            const anotacaoAdicionada = await serviceAnotacao.buscarPorId(anotacaoId);

            return res.status(201).json({mensagem: `[${leitura.titulo}] anotação adicionada com sucesso.`, anotacao: anotacaoAdicionada});
        }catch(e){
            const erro = e as Error;
            return res.status(400).json({erro: erro.message});
        }
    }

    public async listar(req: Request, res: Response): Promise<Response>{
        const repositorioAnotacao = new RepositoryAnotacao();
        const serviceAnotacao = new ServiceAnotacao(repositorioAnotacao);

        const repositorioLeitura = new RepositoryLeitura();
        const serviceLeitura = new ServiceLeitura(repositorioLeitura);

        const leitura_id = Number(req.params.id);

        try{
            const leitura = await serviceLeitura.buscarPorId(leitura_id);

            if(!leitura){
                throw new Error("Leitura não encontrada.");
            }

            const lista = await serviceAnotacao.listar(leitura_id);

            return res.status(200).json({mensagem: `Anotações da leitura [${leitura.titulo}] retornada com sucesso.`, lista})
        }catch(e){
            const erro = e as Error;
            return res.status(400).json({erro: erro.message});
        }
    }

    public async remover(req: Request, res: Response): Promise<Response>{
        const repositorioAnotacao = new RepositoryAnotacao();
        const serviceAnotacao = new ServiceAnotacao(repositorioAnotacao);

        const repositorioLeitura = new RepositoryLeitura();
        const serviceLeitura = new ServiceLeitura(repositorioLeitura);

        const repositorioUsuario = new RepositoryUsuario();
        const serviceUsuario = new ServiceUsuario(repositorioUsuario);

        const {usuario_email, anotacao_id} = req.body;

        try{

            const anotacao = await serviceAnotacao.buscarPorId(anotacao_id);

            if(!anotacao){
                throw new Error("Anotação não encontrada.")
            }

            const usuario = await serviceUsuario.buscarUsuario(usuario_email);

            const usuario_id = usuario.usuario_id;

            if(usuario_id != anotacao.usuario_id){
                throw new Error("Acesso negado.")
            }

            const leituraId = await serviceAnotacao.remover(anotacao_id);

            const leitura = await serviceLeitura.buscarPorId(leituraId);

            return res.status(200).json({message: `Anotação da leitura [${leitura.titulo}] removida com sucesso.`})
        }catch(e){
            const erro = e as Error;
            return res.status(400).json({erro: erro.message});
        }


    }
}