import { Leitura } from "../entities/leitura";
import { Client, credenciais } from "../database/postgresPersistence";

export class RepositoryLeitura{

    public async adicionar(leitura: Leitura){
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoInserir = `
            INSERT INTO leitura (usuario_id, titulo, sub_titulo, tags)
            VALUES ($1, $2, $3, $4)
            RETURNING leitura_id
        `;

        const valoresInserir = [leitura.usuario_id, leitura.titulo, leitura.sub_titulo, leitura.tags];

        const resultado = await clientePg.query(textoInserir, valoresInserir);

        await clientePg.end();

        const leituraId = resultado.rows[0]['leitura_id'];

        return leituraId;
    }

    public async listarGeral(){
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoEncontrar = "SELECT * FROM leitura";

        const resultado = await clientePg.query(textoEncontrar);

        const leituras = []

        for(let i = 0; i < resultado.rows.length; i++){
            leituras[i] = resultado.rows[i] as Leitura;
        }

        return leituras;
    }

    public async listarPorUsuario(usuarioId: number){
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoEncontrar = "SELECT * FROM leitura WHERE usuario_id = $1";
        const valorEncontrar = [usuarioId];

        const resultado = await clientePg.query(textoEncontrar, valorEncontrar);

        const leituras = []

        for(let i = 0; i < resultado.rows.length; i++){
            leituras[i] = resultado.rows[i] as Leitura;
        }

        return leituras;
    }

    public async remover(leituraId: number){
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoEncontrar = "DELETE FROM leitura WHERE leitura_id = $1";
        const valorEncontrar = [leituraId];

        await clientePg.query(textoEncontrar, valorEncontrar);

        return true;
    }
}