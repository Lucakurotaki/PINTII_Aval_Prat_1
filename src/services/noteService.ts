import { Anotacao } from "../entities/note";
import { RepositoryAnotacao } from "../repositories/noteRepository";

export class ServiceAnotacao{
    private repositorio: RepositoryAnotacao;

    constructor(repositoryAnotacao: RepositoryAnotacao){
        this.repositorio = repositoryAnotacao;
    }

    public async adicionar(anotacao: Anotacao): Promise<number>{
        return this.repositorio.adicionar(anotacao);
    }

    public async buscarPorId(anotacaoId: number): Promise<Anotacao>{
        return this.repositorio.buscarPorId(anotacaoId);
    }

    public async listar(leituraId: number): Promise<Anotacao[]>{
        return this.repositorio.listar(leituraId);
    }

    public async remover(anotacaoId: number): Promise<number>{
        return this.repositorio.remover(anotacaoId);
    }
}