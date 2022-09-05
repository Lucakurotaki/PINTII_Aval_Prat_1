import { Client, credenciais } from "../database/postgresPersistence";
import { Usuario } from "../entities/user";

export class RepositoryUsuario{

    public async registrar(usuario: Usuario){
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoInserir = `
            INSERT INTO usuario (usuario_nome, usuario_email, usuario_senha)
            VALUES ($1, $2, $3)
            RETURNING usuario_id
        `;

        const valoresInserir = [usuario.nome, usuario.email, usuario.senha];

        const resultado = await clientePg.query(textoInserir, valoresInserir);
        
        await clientePg.end();

        const usuarioId = resultado.rows[0]['usuario_id'] as number;

        return usuarioId;
    }

    public async ativarConta(email: string){
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoAtualizar = 'UPDATE usuario SET conta_ativa = true WHERE usuario_email = $1';
        const valorAtualizar = [email];

        return await clientePg.query(textoAtualizar, valorAtualizar);
    }

    public async ativarTelefone(email: string, telefone: number){
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoAtualizar = 'UPDATE usuario SET usuario_telefone = $1 WHERE usuario_email = $2';
        const valorAtualizar = [telefone, email];

        return await clientePg.query(textoAtualizar, valorAtualizar);
    }

    public async buscarUsuario(email: string){
        const clientePg = new Client(credenciais);

        await clientePg.connect();

        const textoEncontrar = 'SELECT * FROM usuario WHERE usuario_email = $1';
        const valorEncontrar = [email];

        const resultado = await clientePg.query(textoEncontrar, valorEncontrar);

        await clientePg.end();

        const usuarioEncotrado = resultado.rows[0];

        return usuarioEncotrado;
    }

    public async buscarPorTelefone(telefone: string){
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoEncontrarTelefone = 'SELECT * FROM usuario WHERE usuario_telefone = $1'
        const valorEncontrarTelefone = [telefone];

        const resultadoTelefone = await clientePg.query(textoEncontrarTelefone, valorEncontrarTelefone);

        return resultadoTelefone.rows[0];
    }

}