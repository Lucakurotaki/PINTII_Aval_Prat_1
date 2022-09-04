import { Leitura } from "../entities/leitura";
import { RepositoryLeitura } from "../repositories/leituraRepository";

export class ServiceLeitura{
    private repositorio: RepositoryLeitura;

    constructor(repositoryLeitura: RepositoryLeitura){
        this.repositorio = repositoryLeitura;
    }

    public async adicionar(leitura: Leitura){
        return this.repositorio.adicionar(leitura);
    }

    public async listarGeral(){
        return this.repositorio.listarGeral();
    }

    public async listarPorUsuario(usuarioId: number){
        return this.repositorio.listarPorUsuario(usuarioId);
    }

    public async remover(leituraId: number){
        return this.repositorio.remover(leituraId);
    }
}