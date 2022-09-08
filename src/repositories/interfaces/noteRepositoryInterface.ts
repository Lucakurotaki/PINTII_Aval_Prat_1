import { Anotacao } from "../../entities/note";

export interface InterfaceRepositoryAnotacao{
    adicionar(anotacao: Anotacao): Promise<number>;
    buscarPorId(anotacaoId: number): Promise<Anotacao>;
    listar(leituraId: number): Promise<Anotacao[]>;
    remover(anotacaoId: number): Promise<number>;
}