import { Request, Response } from "express";
import { RepositoryUsuario } from "../repositories/userRepository";
import { Usuario } from '../entities/user';
import { RepositoryToken } from "../repositories/tokenRepository";
import { RepositoryCodigo } from "../repositories/codeRepository";
import { ServiceUsuario } from "../services/userService";
import { ServiceCodigo } from "../services/codeService";
import { ServiceToken } from "../services/tokenService";
import { sendMail } from "../utils/sendMailUtil";

export class ControladorAuth {
    public async cadastrar(req: Request, res: Response): Promise<Response> {

        const repositorioUsuario = new RepositoryUsuario();
        const serviceUsuario = new ServiceUsuario(repositorioUsuario);

        const repositorioCodigo = new RepositoryCodigo();
        const serviceCodigo = new ServiceCodigo(repositorioCodigo);

        const { email, nome, senha } = req.body;

        const usuario = { usuario_email: email, usuario_nome: nome, usuario_senha: senha } as Usuario;

        try {
            const resultado = await serviceUsuario.registrar(usuario);

            if (!resultado) {
                throw new Error("Erro no cadastro inicial.");
            }

            const codigo = await serviceCodigo.gerarCodigoEmail(email);

            await sendMail(nome, email, codigo);

            console.log("----------EMAIL DE ATIVAÇÃO----------\n\nCÓDIGO: ", codigo, "\n\n");

            return res.status(201).json({ mensagem: "Aguardando a ativação." });

        } catch (e) {
            const erro = e as Error;
            return res.status(400).json({ erro: erro.message });
        }
    }

    public async ativarConta(req: Request, res: Response): Promise<Response> {
        const repositorioUsuario = new RepositoryUsuario();
        const serviceUsuario = new ServiceUsuario(repositorioUsuario);

        const repositorioCodigo = new RepositoryCodigo();
        const serviceCodigo = new ServiceCodigo(repositorioCodigo);

        const { email, codigo } = req.body;

        try {
            const usuarioEncontrado = await serviceUsuario.buscarUsuario(email);

            if (usuarioEncontrado.conta_ativa == true) {
                throw new Error("A conta já está ativa.");
            }

            await serviceCodigo.verificarCodigoEmail(email, codigo);

            await serviceUsuario.ativarConta(email);

            return res.status(200).json({mensagem: "Conta ativada."});
        } catch (e) {
            const erro = e as Error;
            return res.status(400).json({ erro: erro.message });
        }
    }

    public async gerarCodigoAtivacao(req: Request, res: Response): Promise<Response>{
        const repositorioUsuario = new RepositoryUsuario();
        const serviceUsuario = new ServiceUsuario(repositorioUsuario);

        const repositorioCodigo = new RepositoryCodigo();
        const serviceCodigo = new ServiceCodigo(repositorioCodigo);

        const { email } = req.body;

        try {
            const usuarioEncontrado = await serviceUsuario.buscarUsuario(email);

            if (usuarioEncontrado.conta_ativa == true) {
                throw new Error("A conta já está ativa.");
            }

            const codigo = await serviceCodigo.gerarCodigoEmail(email);

            console.log("----------EMAIL DE ATIVAÇÃO----------\n\nCÓDIGO: ", codigo, "\n\n");

            return res.status(201).json({ mensagem: "Aguardando a ativação." });

        } catch (e) {
            const erro = e as Error;
            return res.status(400).json({ erro: erro.message });
        }


    }

    public async entrar(req: Request, res: Response): Promise<Response> {
        const repositorioUsuario = new RepositoryUsuario();
        const serviceUsuario = new ServiceUsuario(repositorioUsuario);

        const repositorioToken = new RepositoryToken();
        const serviceToken = new ServiceToken(repositorioToken);

        const { email, senha } = req.body;

        try {
            const resultado = await serviceUsuario.entrar({ usuario_email: email, usuario_senha: senha });

            const tokens = await serviceToken.salvar(email);

            return res.status(200).json({ usuario: resultado, tokens});
        } catch (e) {
            const erro = e as Error;
            return res.status(400).json({ erro: erro.message });
        }
    }

    public async refresh(req: Request, res: Response): Promise<Response> {
        const autoriz = req.headers.authorization;

        if (!autoriz) {
            return res.status(401).json({ erro: "Credenciais não encontrados." });
        }

        const [tipoAutoriz, valorAutoriz] = autoriz.split(" ");

        const repositorioToken = new RepositoryToken();
        const serviceToken = new ServiceToken(repositorioToken);

        try {
            const email = await serviceToken.verificarRefreshToken(valorAutoriz);

            const tokens = await serviceToken.salvar(email);

            return res.status(201).json({ usuario: email, tokens });
        } catch (e) {
            const erro = e as Error;
            return res.status(400).json({ erro: erro.message });
        }
    }

    
}