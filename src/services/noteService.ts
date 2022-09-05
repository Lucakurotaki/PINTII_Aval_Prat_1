import { Anotacao } from "../entities/note";
import { RepositoryAnotacao } from "../repositories/noteRepository";

export class ServiceAnotacao{
    private repositorio: RepositoryAnotacao;

    constructor(repositoryAnotacao: RepositoryAnotacao){
        this.repositorio = repositoryAnotacao;
    }

    public async adicionar(anotacao: Anotacao){
        return this.repositorio.adicionar(anotacao);
    }

    public async buscarPorId(anotacaoId: number){
        return this.repositorio.buscarPorId(anotacaoId);
    }

    public async listar(leituraId: number){
        return this.repositorio.listar(leituraId);
    }

    public async remover(anotacaoId: number){
        return this.repositorio.remover(anotacaoId);
    }
}