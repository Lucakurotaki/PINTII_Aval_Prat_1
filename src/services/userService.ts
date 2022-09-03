import { Usuario } from "../entities/user";
import { RepositoryUsuario } from "../repositories/userRepository";
import bcrypt from 'bcrypt';

export class ServiceUsuario{
    private repositorio: RepositoryUsuario;

    constructor(repositoryUsuario: RepositoryUsuario){
        this.repositorio = repositoryUsuario;
    }

    public async registrar(usuario: Usuario){
        const usuarioEncontrado = await this.repositorio.encontrarUsuario(usuario.email);

        if(usuarioEncontrado != undefined){
            throw new Error("Já existe uma conta com este email.");
        }

        const salt = bcrypt.genSaltSync();
        usuario.senha = bcrypt.hashSync(usuario.senha, salt);

        const usuarioCadastradoId = this.repositorio.registrar(usuario);

        return usuarioCadastradoId;
    }

    public async ativarConta(email: string){
        await this.repositorio.ativarConta(email);

        return {mensagem: "Conta ativada."}
    }

    public async entrar(usuario: Usuario){
        const usuarioEncontrado = await this.repositorio.encontrarUsuario(usuario.email);

        if(usuarioEncontrado == undefined){
            throw new Error("Conta não encontrada.");
        }

        if(!usuarioEncontrado['conta_ativa']){
            throw new Error("Conta não ativada.");
        }

        if(!bcrypt.compareSync(usuario.senha, usuarioEncontrado['usuario_senha'])){
            throw new Error("Senha inválida.");
        }

        return usuarioEncontrado;
    }

    public async ativarTelefone(email: string, telefone: number){
        await this.repositorio.ativarTelefone(email, telefone);

        return {mensagem: "Telefone ativado."}
    }
}