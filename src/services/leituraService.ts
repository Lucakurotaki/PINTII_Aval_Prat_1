import { Leitura } from "../entities/leitura";
import { InterfaceRepositoryLeitura } from "../repositories/interfaces/leituraRepositoryInterface";

export class ServiceLeitura{
    private repositorio: InterfaceRepositoryLeitura;

    constructor(repositoryLeitura: InterfaceRepositoryLeitura){
        this.repositorio = repositoryLeitura;
    }

    public async adicionar(leitura: Leitura):Promise<number>{
        return this.repositorio.adicionar(leitura);
    }

    public async listarGeral(): Promise<Leitura[]>{
        return this.repositorio.listarGeral();
    }

    public async listarPorUsuario(usuarioId: number): Promise<Leitura[]>{
        return this.repositorio.listarPorUsuario(usuarioId);
    }

    public async buscarPorId(leituraId: number): Promise<Leitura>{
        return this.repositorio.buscarPorId(leituraId);
    }

    public async remover(leituraId: number): Promise<string>{
        return this.repositorio.remover(leituraId);
    }

    public async definirPagina(leituraId: number, pagina: number): Promise<number>{
        return this.repositorio.definirPagina(leituraId, pagina);
    }

    public async definirStatus(leituraId: number, status: string): Promise<string>{
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