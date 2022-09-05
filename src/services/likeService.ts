import { Like } from "../entities/like";
import { RepositoryLike } from "../repositories/likeRepository";

export class ServiceLike{
    private repositorio: RepositoryLike;

    constructor(repositoryLike: RepositoryLike){
        this.repositorio = repositoryLike;
    }

    public async curtir(like: Like){
        const likes = await this.repositorio.listar(like.leitura_id);

        for(let i = 0; i < likes.length; i++){
            if(likes[i].leitura_id == like.leitura_id && likes[i].usuario_id == like.usuario_id){
                throw new Error("A leitura já está curtida.");
            }
        }
        return this.repositorio.curtir(like);
    }

    public async buscarPorId(likeId: number){
        return this.repositorio.buscarPorId(likeId);
    }

    public async descurtir(likeId: number){
        return this.repositorio.descurtir(likeId);
    }

    public async listar(leituraId: number){
        return this.repositorio.listar(leituraId);
    }
}