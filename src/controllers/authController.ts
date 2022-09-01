import { Request, Response} from "express";
import { RepositorioAutent } from "../repositories/authRepository";
import {Usuario} from '../entities/user';
import { RepositorioAutentToken } from "../repositories/tokenRepository";

export class ControladorAutent{
    public async cadastrar (req: Request, res: Response): Promise<Response>{
        
        const repositorio = new RepositorioAutent();

        const {email, nome, senha} = req.body;

        const usuario = {email, nome, senha} as Usuario;

        try{
            const resultado = await repositorio.registrar(usuario);

            if(!resultado){
                throw new Error("Erro no cadastro inicial.");
            }

            await repositorio.gerarCodigoAtiv(email);

            return res.status(201).json({mensagem: "Aguardando a ativação."});

        }catch(e){
            const erro = e as Error;
            console.log(erro);
            return res.status(400).json({erro: erro.message});
        }
    }

    public async ativar(req: Request, res: Response): Promise<Response>{
        const repositorio = new RepositorioAutent();

        const {email, codigo} = req.body;

        try{
            const resultado = await repositorio.ativarConta(email, codigo);

            return res.status(200).json(resultado);
        }catch(e){
            const erro = e as Error;
            return res.status(400).json({erro: erro.message});
        }
    }

    public async entrar(req: Request, res: Response): Promise<Response>{
        const repositorio = new RepositorioAutent();
        const repositorioToken = new RepositorioAutentToken();

        const {email, senha} = req.body;

        try{
            const resultado = await repositorio.entrar({email, senha});

            const tokens = await repositorioToken.salvar(email);

            return res.status(200).json({usuario: resultado, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken});
        }catch(e){
            const erro = e as Error;
            return res.status(400).json({erro: erro.message});
        }
    }
}