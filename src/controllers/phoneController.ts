import { Request, Response } from "express";
import { RepositoryUsuario } from "../repositories/userRepository";
import { RepositoryToken } from "../repositories/tokenRepository";
import { RepositoryCodigo } from "../repositories/codeRepository";
import { ServiceUsuario } from "../services/userService";
import { ServiceCodigo } from "../services/codeService";
import { ServiceToken } from "../services/tokenService";

export class ControladorTelefone{
    public async cadastrarTelefone(req: Request, res: Response): Promise<Response> {
        const repositorioUsuario = new RepositoryUsuario();
        const serviceUsuario = new ServiceUsuario(repositorioUsuario);

        const repositorioCodigo = new RepositoryCodigo();
        const serviceCodigo = new ServiceCodigo(repositorioCodigo);

        const { email, telefone } = req.body;

        try {
            const usuarioEncontrado = await serviceUsuario.buscarUsuario(email);

            if (!usuarioEncontrado['conta_ativa']) {
                throw new Error("Conta não ativada.");
            }

            if (usuarioEncontrado['usuario_telefone'] != null) {
                throw new Error("O telefone já está ativo.");
            }

            const telefoneString = telefone.toString();

            const usuarioTelefone = await serviceUsuario.buscarPorTelefone(telefoneString);

            if (usuarioTelefone != undefined) {
                throw new Error("Já existe uma conta cadastrada com esse número.");
            }

            const codigo = await serviceCodigo.gerarCodigoSMS(telefone);

            console.log("----------SMS DE ATIVAÇÃO----------\n\nCÓDIGO: ", codigo, "\n\n");

            return res.status(201).json({ mensagem: "Aguardando a ativação." });

        } catch (e) {
            const erro = e as Error;
            return res.status(400).json({ erro: erro.message });
        }
    }

    public async ativarTelefone(req: Request, res: Response): Promise<Response> {
        const repositorioUsuario = new RepositoryUsuario();
        const serviceUsuario = new ServiceUsuario(repositorioUsuario);

        const repositorioCodigo = new RepositoryCodigo();
        const serviceCodigo = new ServiceCodigo(repositorioCodigo);

        const { telefone, codigo, email } = req.body;

        try {

            const usuarioTelefone = await serviceUsuario.buscarPorTelefone(telefone);

            if(usuarioTelefone != undefined){
                throw new Error("Já existe uma conta cadastrada com esse número.")
            }

            const usuarioEmail = await serviceUsuario.buscarUsuario(email);

            if (usuarioEmail['usuario_telefone'] != undefined) {
                throw new Error("O telefone já está ativo.");
            }

            await serviceCodigo.verificarCodigoSMS(telefone, codigo);

            const resultado = await serviceUsuario.registrarTelefone(email, telefone);

            return res.status(200).json(resultado);
        } catch (e) {
            const erro = e as Error;
            return res.status(400).json({ erro: erro.message });
        }
    }

    public async entrarRequisicao(req: Request, res: Response): Promise<Response> {
        const repositorioUsuario = new RepositoryUsuario();
        const serviceUsuario = new ServiceUsuario(repositorioUsuario);

        const repositorioCodigo = new RepositoryCodigo();
        const serviceCodigo = new ServiceCodigo(repositorioCodigo);

        const { telefone } = req.body;

        try{
            const usuarioTelefone = await serviceUsuario.buscarPorTelefone(telefone);

            if (usuarioTelefone == undefined) {
                throw new Error("Telefone não cadastrado.");
            }

            const codigo = await serviceCodigo.gerarCodigoSMS(telefone);

            console.log("----------SMS DE CONFIRMAÇÃO----------\n\nCÓDIGO: ", codigo, "\n\n");

            return res.status(201).json({ mensagem: "Aguardando a confirmação." });

        }catch(e){
            const erro = e as Error;
            return res.status(400).json({erro: erro.message});
        }
    }

    public async entrarConfirmacao(req: Request, res: Response): Promise<Response>{
        const repositorioUsuario = new RepositoryUsuario();
        const serviceUsuario = new ServiceUsuario(repositorioUsuario);

        const repositorioToken = new RepositoryToken();
        const serviceToken = new ServiceToken(repositorioToken);

        const repositorioCodigo = new RepositoryCodigo();
        const serviceCodigo = new ServiceCodigo(repositorioCodigo);

        const { telefone, codigo } = req.body;

        try{
            await serviceCodigo.verificarCodigoSMS(telefone, codigo);

            const telefoneString = telefone.toString();
            const usuarioTelefone = await serviceUsuario.buscarPorTelefone(telefoneString);

            const email = usuarioTelefone['usuario_email'];

            const tokens = await serviceToken.salvar(email);

            return res.status(200).json({ usuario: usuarioTelefone, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
        }catch (e) {
            const erro = e as Error;
            return res.status(400).json({ erro: erro.message });
        }
    }

    public async alterarRequisicao(req: Request, res: Response): Promise<Response>{
        const repositorioUsuario = new RepositoryUsuario();
        const serviceUsuario = new ServiceUsuario(repositorioUsuario);

        const repositorioCodigo = new RepositoryCodigo();
        const serviceCodigo = new ServiceCodigo(repositorioCodigo);

        const { telefone, telefoneNovo } = req.body;

        try{
            const telefoneString = telefone.toString();

            const usuarioTelefone = await serviceUsuario.buscarPorTelefone(telefoneString);

            if (usuarioTelefone == undefined) {
                throw new Error("Telefone não cadastrado.");
            }

            const telefoneNovoString = telefoneNovo.toString();
            const usuarioTelefoneNovo = await serviceUsuario.buscarPorTelefone(telefoneNovoString);

            if(usuarioTelefoneNovo != undefined){
                throw new Error("Já existe uma conta cadastrada com esse número novo.")
            }

            const codigo = await serviceCodigo.gerarCodigoSMS(telefoneNovo);

            console.log("----------SMS DE CONFIRMAÇÂO----------\n\nCÓDIGO: ", codigo, "\n\n");

            return res.status(201).json({ mensagem: "Aguardando a confirmação." });
        }catch (e) {
            const erro = e as Error;
            return res.status(400).json({ erro: erro.message });
        }
    }

    public async alterarConfirmacao(req: Request, res: Response): Promise<Response>{
        const repositorioUsuario = new RepositoryUsuario();
        const serviceUsuario = new ServiceUsuario(repositorioUsuario);

        const repositorioCodigo = new RepositoryCodigo();
        const serviceCodigo = new ServiceCodigo(repositorioCodigo);

        const { telefone, telefoneNovo, codigo } = req.body;

        try{
            const usuarioTelefoneNovo = await serviceUsuario.buscarPorTelefone(telefoneNovo);

            if(usuarioTelefoneNovo != undefined){
                throw new Error("Já existe uma conta cadastrada com esse número.")
            }

            const usuarioTelefone = await serviceUsuario.buscarPorTelefone(telefone);

            const email = usuarioTelefone['usuario_email'];

            await serviceCodigo.verificarCodigoSMS(telefoneNovo, codigo);

            await serviceUsuario.registrarTelefone(email, telefoneNovo);

            return res.status(200).json({mensagem: "Telefone alterado com sucesso."});
        }catch(e){
            const erro = e as Error;
            return res.status(400).json({erro: erro.message});
        }
    }
}