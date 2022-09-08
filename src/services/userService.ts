import { Usuario } from "../entities/user";
import { RepositoryUsuario } from "../repositories/userRepository";
import bcrypt from 'bcrypt';

export class ServiceUsuario{
    private repositorio: RepositoryUsuario;

    constructor(repositoryUsuario: RepositoryUsuario){
        this.repositorio = repositoryUsuario;
    }

    public async registrar(usuario: Usuario): Promise<number>{
        const usuarioEncontrado = await this.repositorio.buscarUsuario(usuario.usuario_email);

        if(usuarioEncontrado != undefined){
            throw new Error("Já existe uma conta com este email.");
        }

        const salt = bcrypt.genSaltSync();
        usuario.usuario_senha = bcrypt.hashSync(usuario.usuario_senha, salt);

        const usuarioCadastradoId = this.repositorio.registrar(usuario);

        return usuarioCadastradoId;
    }

    public async ativarConta(email: string): Promise<boolean>{
        return await this.repositorio.ativarConta(email);
    }

    public async entrar(usuario: Usuario):Promise<Usuario>{
        const usuarioEncontrado = await this.repositorio.buscarUsuario(usuario.usuario_email);

        if(usuarioEncontrado == undefined){
            throw new Error("Conta não encontrada.");
        }

        if(!usuarioEncontrado.conta_ativa){
            throw new Error("Conta não ativada.");
        }

        if(!bcrypt.compareSync(usuario.usuario_senha, usuarioEncontrado.usuario_senha)){
            throw new Error("Senha inválida.");
        }

        return usuarioEncontrado;
    }

    public async registrarTelefone(email: string, telefone: number):Promise<boolean>{
        return await this.repositorio.registrarTelefone(email, telefone);
    }

    public async buscarUsuario(email: string): Promise<Usuario>{
        const usuarioEncontrado = await this.repositorio.buscarUsuario(email);

        if (usuarioEncontrado == undefined) {
            throw new Error("Usuario não cadastrado.");
        }

        return usuarioEncontrado;
    }

    public async buscarPorTelefone(telefone: number):Promise<Usuario>{
        const telefoneString = telefone.toString();

        return this.repositorio.buscarPorTelefone(telefoneString);
    }
}