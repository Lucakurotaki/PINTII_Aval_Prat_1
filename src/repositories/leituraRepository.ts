import { Leitura } from "../entities/leitura";
import { Client, credenciais } from "../database/postgresPersistence";

export class RepositoryLeitura{

    public async adicionar(leitura: Leitura): Promise<number>{
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoInserir = `
            INSERT INTO leitura (usuario_id, titulo, sub_titulo, tags, status)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING leitura_id
        `;

        const valoresInserir = [leitura.usuario_id, leitura.titulo, leitura.sub_titulo, leitura.tags, "EM ANDAMENTO"];

        const resultado = await clientePg.query(textoInserir, valoresInserir);

        await clientePg.end();

        const leituraId = resultado.rows[0]['leitura_id'];

        return leituraId;
    }

    public async listarGeral():Promise<Leitura[]>{
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoEncontrar = "SELECT * FROM leitura";

        const resultado = await clientePg.query(textoEncontrar);

        await clientePg.end();

        const leituras = []

        for(let i = 0; i < resultado.rows.length; i++){
            leituras[i] = resultado.rows[i] as Leitura;
        }

        return leituras;
    }

    public async listarPorUsuario(usuarioId: number): Promise<Leitura[]>{
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoEncontrar = "SELECT * FROM leitura WHERE usuario_id = $1";
        const valorEncontrar = [usuarioId];

        const resultado = await clientePg.query(textoEncontrar, valorEncontrar);

        await clientePg.end();

        const leituras = []

        for(let i = 0; i < resultado.rows.length; i++){
            leituras[i] = resultado.rows[i] as Leitura;
        }

        return leituras;
    }

    public async buscarPorId(leituraId: number): Promise<Leitura>{
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoEncontrar = "SELECT * FROM leitura WHERE leitura_id = $1";
        const valorEncontrar = [leituraId];

        const resultado = await clientePg.query(textoEncontrar, valorEncontrar);

        await clientePg.end();

        return resultado.rows[0] as Leitura;
    }

    public async remover(leituraId: number):Promise<string>{
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoEncontrar = "DELETE FROM leitura WHERE leitura_id = $1 RETURNING titulo";
        const valorEncontrar = [leituraId];

        const resultado = await clientePg.query(textoEncontrar, valorEncontrar);

        await clientePg.end();

        return resultado.rows[0]['titulo'];
    }

    public async definirPagina(leituraId: number, pagina: number):Promise<number>{
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoEncontrar = "UPDATE leitura SET pagina_atual = $1 WHERE leitura_id = $2 RETURNING pagina_atual";
        const valorEncontrar = [pagina, leituraId];

        const resultado = await clientePg.query(textoEncontrar, valorEncontrar);

        await clientePg.end();

        return resultado.rows[0]['pagina_atual'];
    }

    public async definirStatus(leituraId: number, status: string):Promise<string>{
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoEncontrar = "UPDATE leitura SET status = $1 WHERE leitura_id = $2 RETURNING status";
        const valorEncontrar = [status, leituraId];

        const resultado = await clientePg.query(textoEncontrar, valorEncontrar);

        await clientePg.end();

        return resultado.rows[0]['status'];
    }
}