import { Leitura } from "../../entities/leitura";

export interface InterfaceRepositoryLeitura{
    adicionar(leitura: Leitura): Promise<number>;
    listarGeral():Promise<Leitura[]>;
    listarPorUsuario(usuarioId: number): Promise<Leitura[]>;
    buscarPorId(leituraId: number): Promise<Leitura>;
    remover(leituraId: number):Promise<string>;
    definirPagina(leituraId: number, pagina: number):Promise<number>;
    definirStatus(leituraId: number, status: string):Promise<string>;
}