import { Like } from "../../entities/like";

export interface InterfaceRepositoryLike{
    curtir(like: Like): Promise<number>;
    buscarPorId(likeId: number): Promise<Like>;
    descurtir(likeId: number): Promise<number>;
    listar(leituraId: number): Promise<Like[]>;
}