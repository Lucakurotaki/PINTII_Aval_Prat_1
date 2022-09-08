import { Like } from "../entities/like";
import { InterfaceRepositoryLike } from "../repositories/interfaces/likeRepositoryInterface";

export class ServiceLike{
    private repositorio: InterfaceRepositoryLike;

    constructor(repositoryLike: InterfaceRepositoryLike){
        this.repositorio = repositoryLike;
    }

    public async curtir(like: Like): Promise<number>{
        const likes = await this.repositorio.listar(like.leitura_id);

        for(let i = 0; i < likes.length; i++){
            if(likes[i].leitura_id == like.leitura_id && likes[i].usuario_id == like.usuario_id){
                throw new Error("A leitura já está curtida.");
            }
        }
        return this.repositorio.curtir(like);
    }

    public async buscarPorId(likeId: number): Promise<Like>{
        return this.repositorio.buscarPorId(likeId);
    }

    public async descurtir(likeId: number): Promise<number>{
        return this.repositorio.descurtir(likeId);
    }

    public async listar(leituraId: number): Promise<Like[]>{
        return this.repositorio.listar(leituraId);
    }
}