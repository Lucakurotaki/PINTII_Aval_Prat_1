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
            const usuario = await serviceUsuario.buscarUsuario(usuario_email);

            const usuario_id = usuario['usuario_id'];

            const leitura = {usuario_id, titulo, sub_titulo, tags} as Leitura;

            const leituraId = await serviceLeitura.adicionar(leitura);

            const leituraAdicionado = await serviceLeitura.buscarPorId(leituraId);

            return res.status(201).json({mensagem: "Leitura adicionada com sucesso.", leitura: leituraAdicionado});

        }catch(e){
            const erro = e as Error;
            return res.status(400).json({erro: erro.message});
        }
    }

    public async listarGeral(req: Request, res: Response):Promise<Response>{
        const repositorioLeitura = new RepositoryLeitura();
        const serviceLeitura = new ServiceLeitura(repositorioLeitura);

        try{
            
            const lista = await serviceLeitura.listarGeral();

            return res.status(201).json({lista});

        }catch(e){
            const erro = e as Error;
            return res.status(400).json({erro: erro.message});
        }
    }

    public async listarPorUsuario(req: Request, res: Response): Promise<Response>{
        const repositorioLeitura = new RepositoryLeitura();
        const serviceLeitura = new ServiceLeitura(repositorioLeitura);

        const usuario_id = Number(req.params.id);

        try{

            const lista = await serviceLeitura.listarPorUsuario(usuario_id);

            return res.status(201).json({lista});


        }catch(e){
            const error = e as Error;
            return res.status(400).json({error: error.message});
        }
    }

    public async remover(req: Request, res: Response): Promise<Response>{
        const repositorioLeitura = new RepositoryLeitura();
        const serviceLeitura = new ServiceLeitura(repositorioLeitura);
        
        const repositorioUsuario = new RepositoryUsuario();
        const serviceUsuario = new ServiceUsuario(repositorioUsuario);

        const {usuario_email, leitura_id} = req.body;

        try{
            const usuario = await serviceUsuario.buscarUsuario(usuario_email);
            
            const leitura = await serviceLeitura.buscarPorId(leitura_id);

            if(usuario['usuario_id'] != leitura.usuario_id){
                throw new Error("Acesso negado.");
            }

            const resultado = await serviceLeitura.remover(leitura_id);

            return res.status(200).json({mensagem: `Leitura [${resultado}] removida com sucesso.`});

            
        }catch(e){
            const erro = e as Error;
            return res.status(400).json({erro: erro.message});
        }
    }

    public async definirPagina(req: Request, res: Response): Promise<Response>{
        const repositorioLeitura = new RepositoryLeitura();
        const serviceLeitura = new ServiceLeitura(repositorioLeitura);
        
        const repositorioUsuario = new RepositoryUsuario();
        const serviceUsuario = new ServiceUsuario(repositorioUsuario);

        const {usuario_email, leitura_id, pagina} = req.body;

        try{
            const usuario = await serviceUsuario.buscarUsuario(usuario_email);
            
            const leitura = await serviceLeitura.buscarPorId(leitura_id);

            if(usuario['usuario_id'] != leitura.usuario_id){
                throw new Error("Acesso negado.");
            }

            const resultado = await serviceLeitura.definirPagina(leitura_id, pagina);

            return res.status(200).json({mensagem: `A página atual da leitura [${leitura.titulo}] definida como ${resultado}.`});

            
        }catch(e){
            const erro = e as Error;
            return res.status(400).json({erro: erro.message});
        }
    }

    public async definirStatus(req: Request, res: Response): Promise<Response>{
        const repositorioLeitura = new RepositoryLeitura();
        const serviceLeitura = new ServiceLeitura(repositorioLeitura);
        
        const repositorioUsuario = new RepositoryUsuario();
        const serviceUsuario = new ServiceUsuario(repositorioUsuario);

        const {usuario_email, leitura_id, status} = req.body;

        try{
            const usuario = await serviceUsuario.buscarUsuario(usuario_email);
            
            const leitura = await serviceLeitura.buscarPorId(leitura_id);

            if(usuario['usuario_id'] != leitura.usuario_id){
                throw new Error("Acesso negado.");
            }

            const resultado = await serviceLeitura.definirStatus(leitura_id, status);

            return res.status(200).json({mensagem: `O status da leitura [${leitura.titulo}] definida como ${resultado}.`});

            
        }catch(e){
            const erro = e as Error;
            return res.status(400).json({erro: erro.message});
        }
    }
}