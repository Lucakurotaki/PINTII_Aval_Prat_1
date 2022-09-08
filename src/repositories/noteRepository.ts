import { Anotacao } from "../entities/note";
import { Client, credenciais } from "../database/postgresPersistence";

export class RepositoryAnotacao{
    public async adicionar(anotacao: Anotacao): Promise<number>{
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoInserir = `
            INSERT INTO anotacao (leitura_id, usuario_id, texto)
            VALUES ($1, $2, $3)
            RETURNING anotacao_id
        `;

        const valoresInserir = [anotacao.leitura_id, anotacao.usuario_id, anotacao.texto];

        const resultado = await clientePg.query(textoInserir, valoresInserir);

        await clientePg.end();

        const leituraId = resultado.rows[0]['anotacao_id'];

        return leituraId;
    }

    public async buscarPorId(anotacaoId: number): Promise<Anotacao>{
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoEncontrar = "SELECT * FROM anotacao WHERE anotacao_id = $1";
        const valorEncontrar = [anotacaoId];

        const resultado = await clientePg.query(textoEncontrar, valorEncontrar);
        
        await clientePg.end();

        return resultado.rows[0] as Anotacao;
    }

    public async listar(leituraId: number): Promise<Anotacao[]>{
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoEncontrar = "SELECT * FROM anotacao WHERE leitura_id = $1";
        const valorEncontrar = [leituraId];

        const resultado = await clientePg.query(textoEncontrar, valorEncontrar);

        await clientePg.end();

        const anotacoes = []

        for(let i = 0; i < resultado.rows.length; i++){
            anotacoes[i] = resultado.rows[i] as Anotacao;
        }

        return anotacoes;
    }

    public async remover(anotacaoId: number): Promise<number>{
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoEncontrar = "DELETE FROM anotacao WHERE anotacao_id = $1 RETURNING leitura_id";
        const valorEncontrar = [anotacaoId];

        const resultado = await clientePg.query(textoEncontrar, valorEncontrar);

        await clientePg.end();

        return resultado.rows[0]['leitura_id'];
    }
}