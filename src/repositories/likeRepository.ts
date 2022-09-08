import { Client, credenciais } from "../database/postgresPersistence";
import { Like } from "../entities/like";
import { InterfaceRepositoryLike } from "./interfaces/likeRepositoryInterface";

export class RepositoryLike implements InterfaceRepositoryLike{
    public async curtir(like: Like): Promise<number>{
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoInserir = `
            INSERT INTO likes (leitura_id, usuario_id)
            VALUES ($1, $2)
            RETURNING like_id
        `;

        const valoresInserir = [like.leitura_id, like.usuario_id];

        const resultado = await clientePg.query(textoInserir, valoresInserir);

        await clientePg.end();

        return resultado.rows[0]['like_id'];
    }

    public async buscarPorId(likeId: number): Promise<Like>{
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoEncontrar = "SELECT * FROM likes WHERE like_id = $1";
        const valorEncontrar = [likeId];

        const resultado = await clientePg.query(textoEncontrar, valorEncontrar);

        await clientePg.end();

        return resultado.rows[0] as Like;
    }

    public async descurtir(likeId: number): Promise<number>{
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoEncontrar = "DELETE FROM likes WHERE like_id = $1 RETURNING leitura_id";
        const valorEncontrar = [likeId];

        const resultado = await clientePg.query(textoEncontrar, valorEncontrar);

        await clientePg.end();

        return resultado.rows[0]['leitura_id'];
    }

    public async listar(leituraId: number): Promise<Like[]>{
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoEncontrar = "SELECT * FROM likes WHERE leitura_id = $1";
        const valorEncontrar = [leituraId];

        const resultado = await clientePg.query(textoEncontrar, valorEncontrar);

        await clientePg.end();

        const likes = []

        for(let i = 0; i < resultado.rows.length; i++){
            likes[i] = resultado.rows[i] as Like;
        }

        return likes;
    }
}