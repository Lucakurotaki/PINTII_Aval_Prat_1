import { RepositoryAtivacao } from "../repositories/activationRepository";
import { RepositoryUsuario } from "../repositories/userRepository";

export class ServiceAtivacao{
    private repositorioAtivacao: RepositoryAtivacao;
    private repositorioUsuario: RepositoryUsuario;

    constructor(repositoryAtivacao: RepositoryAtivacao, repositoryUsuario: RepositoryUsuario){
        this.repositorioAtivacao = repositoryAtivacao;
        this.repositorioUsuario = repositoryUsuario;
    }

    public async gerarCodigoEmail(email: string){
        const codigo = (Math.floor(Math.random() * 99999) + 10000).toString();
        const iat = Date.now().toString();

        await this.repositorioAtivacao.registrarCodigoEmail(email, codigo, iat);

        return codigo;
    }

    public async verificarCodigoEmail(email: string, codigo: number){
        const agora = Date.now();
        const codigoString = codigo.toString()

        const usuarioEncontrado = await this.repositorioUsuario.buscarUsuario(email);

        if(usuarioEncontrado == undefined){
            throw new Error("Usuario não cadastrado.");
        }

        if(usuarioEncontrado["conta_ativa"] == true){
            throw new Error("A conta já está ativa.");
        }

        const ativacaoEncontrado = await this.repositorioAtivacao.verificarCodigoEmail(email, codigoString);

        if(ativacaoEncontrado == undefined){
            throw new Error("Código inválido.");
        }
        const iatEncontrado = ativacaoEncontrado['iat'];

        if(agora - Number(iatEncontrado) > 7200000){
            throw new Error("Código expirado.");
        }

        return true;
    }

    public async gerarCodigoSMS(email: string, telefone: number){
        const usuarioEncontrado = await this.repositorioUsuario.buscarUsuario(email);

        if(usuarioEncontrado == undefined){
            throw new Error("Usuário não cadastrado.");
        }

        if(!usuarioEncontrado['conta_ativa']){
            throw new Error("Conta não ativada.");
        }

        if(usuarioEncontrado['usuario_telefone'] != null){
            throw new Error("O telefone já está ativo.");
        }

        const telefoneString = telefone.toString();

        const usuarioTelefone = await this.repositorioUsuario.buscarPorTelefone(telefoneString);

        if(usuarioTelefone != undefined){
            throw new Error("Já existe uma conta cadastrada com esse número.");
        }

        const codigo = (Math.floor(Math.random() * 99999) + 10000).toString();
        const iat = Date.now().toString();

        await this.repositorioAtivacao.registrarCodigoSMS(telefoneString, codigo, iat);

        return codigo;
    }

    public async verificarCodigoSMS(telefone: number, codigo: number){

        const agora = Date.now();
        const codigoString = codigo.toString();
        const telefoneString = telefone.toString();

        const usuarioTelefone = await this.repositorioUsuario.buscarPorTelefone(telefoneString);

        if(usuarioTelefone != undefined){
            throw new Error("O telefone já está ativo.");
        }

        const resultado = await this.repositorioAtivacao.verificarCodigoSMS(telefoneString, codigoString);

        if(resultado == undefined){
            throw new Error("Código e/ou telefone inválido.");
        }
        const iatEncontrado = resultado['iat'];

        if(agora - Number(iatEncontrado) > 7200000){
            throw new Error("Código expirado.")
        }

        return true;
    }
}