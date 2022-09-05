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

    public async buscarPorId(leituraId: number){
        return this.repositorio.buscarPorId(leituraId);
    }

    public async remover(leituraId: number){
        return this.repositorio.remover(leituraId);
    }

    public async definirPagina(leituraId: number, pagina: number){
        return this.repositorio.definirPagina(leituraId, pagina);
    }

    public async definirStatus(leituraId: number, status: string){
        const statusUC = status.toUpperCase();
        if(statusUC != "PARADA" && statusUC != "CONCLUIDA" && statusUC != "EM ANDAMENTO"){
            throw new Error("O valor deve ser 'PARADA', 'CONCLUIDA' ou 'EM ANDAMENTO'");
        }

        const leitura = await this.repositorio.buscarPorId(leituraId);

        if(leitura.status == statusUC){
            throw new Error(`O status já está marcado como ${statusUC}`);
        }
        
        return this.repositorio.definirStatus(leituraId, statusUC);
    }
}