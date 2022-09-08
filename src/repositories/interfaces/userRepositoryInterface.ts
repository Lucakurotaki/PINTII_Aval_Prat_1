import { Usuario } from "../../entities/user";

export interface InterfaceRepositoryUsuario{
    registrar(usuario: Usuario): Promise<number>;
    ativarConta(email: string): Promise<boolean>;
    registrarTelefone(email: string, telefone: number): Promise<boolean>;
    buscarUsuario(email: string): Promise<Usuario>;
    buscarPorTelefone(telefone: string): Promise<Usuario>;
}