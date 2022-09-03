import { Request, Response} from "express";
import { RepositoryUsuario } from "../repositories/userRepository";
import {Usuario} from '../entities/user';
import { RepositoryToken } from "../repositories/tokenRepository";
import { RepositoryAtivacao } from "../repositories/activationRepository";
import { ServiceUsuario } from "../services/userService";
import { ServiceAtivacao } from "../services/activationService";
import { ServiceToken } from "../services/tokenService";

export class ControladorAuth{
    public async cadastrar (req: Request, res: Response): Promise<Response>{
        
        const repositorioUsuario = new RepositoryUsuario();
        const serviceUsuario = new ServiceUsuario(repositorioUsuario);

        const repositorioAtivacao = new RepositoryAtivacao();
        const serviceAtivacao = new ServiceAtivacao(repositorioAtivacao, repositorioUsuario);

        const {email, nome, senha} = req.body;

        const usuario = {email, nome, senha} as Usuario;

        try{
            const resultado = await serviceUsuario.registrar(usuario);

            if(!resultado){
                throw new Error("Erro no cadastro inicial.");
            }

            const codigo = await serviceAtivacao.gerarCodigoEmail(email);

            console.log("----------EMAIL DE ATIVAÇÃO----------\n\nCÓDIGO: ", codigo, "\n\n");

            return res.status(201).json({mensagem: "Aguardando a ativação."});

        }catch(e){
            const erro = e as Error;
            return res.status(400).json({erro: erro.message});
        }
    }

    public async ativarConta(req: Request, res: Response): Promise<Response>{
        const repositorioUsuario = new RepositoryUsuario();
        const serviceUsuario = new ServiceUsuario(repositorioUsuario);

        const repositorioAtivacao = new RepositoryAtivacao();
        const serviceAtivacao = new ServiceAtivacao(repositorioAtivacao, repositorioUsuario);

        const {email, codigo} = req.body;

        try{
            await serviceAtivacao.verificarCodigoEmail(email, codigo);

            const resultado = await serviceUsuario.ativarConta(email);

            return res.status(200).json(resultado);
        }catch(e){
            const erro = e as Error;
            return res.status(400).json({erro: erro.message});
        }
    }

    public async entrar(req: Request, res: Response): Promise<Response>{
        const repositorioUsuario = new RepositoryUsuario();
        const serviceUsuario = new ServiceUsuario(repositorioUsuario);

        const repositorioToken = new RepositoryToken();
        const serviceToken = new ServiceToken(repositorioToken);

        const {email, senha} = req.body;

        try{
            const resultado = await serviceUsuario.entrar({email, senha});

            const tokens = await serviceToken.salvar(email);

            return res.status(200).json({usuario: resultado, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken});
        }catch(e){
            const erro = e as Error;
            return res.status(400).json({erro: erro.message});
        }
    }

    public async refresh(req: Request, res: Response): Promise<Response>{
        const autoriz = req.headers.authorization;

        if(!autoriz){
            return res.status(401).json({erro: "Credenciais não encontrados."});
        }

        const [tipoAutoriz, valorAutoriz] = autoriz.split(" ");

        const repositorioToken = new RepositoryToken();
        const serviceToken = new ServiceToken(repositorioToken);

        try{
            const email = await serviceToken.verificarRefreshToken(valorAutoriz);

            const tokens = await serviceToken.salvar(email);

            const accessToken = tokens.accessToken;
            const refreshToken = tokens.refreshToken;

            return res.status(201).json({accessToken, refreshToken});
        }catch(e){
            const erro = e as Error;
            return res.status(400).json({erro: erro.message});
        }
    }

    public async cadastrarTelefone(req: Request, res: Response): Promise<Response>{
        const repositorioUsuario = new RepositoryUsuario();

        const repositorioAtivacao = new RepositoryAtivacao();
        const serviceAtivacao = new ServiceAtivacao(repositorioAtivacao, repositorioUsuario);

        const {email, telefone} = req.body;

        try{
            const codigo = await serviceAtivacao.gerarCodigoSMS(email, telefone);

            console.log("----------SMS DE ATIVAÇÃO----------\n\nCÓDIGO: ", codigo, "\n\n");

            return res.status(201).json({mensagem: "Aguardando a ativação."});

        }catch(e){
            const erro = e as Error;
            return res.status(400).json({erro: erro.message});
        }
    }

    public async ativarTelefone(req: Request, res: Response): Promise<Response>{
        const repositorioUsuario = new RepositoryUsuario();
        const serviceUsuario = new ServiceUsuario(repositorioUsuario);

        const repositorioAtivacao = new RepositoryAtivacao();
        const serviceAtivacao = new ServiceAtivacao(repositorioAtivacao, repositorioUsuario);

        const {telefone, codigo, email} = req.body;

        try{
            await serviceAtivacao.verificarCodigoSMS(telefone, codigo);

            const resultado = await serviceUsuario.ativarTelefone(email, telefone);

            return res.status(200).json(resultado);
        }catch(e){
            const erro = e as Error;
            return res.status(400).json({erro: erro.message});
        }
    }
}