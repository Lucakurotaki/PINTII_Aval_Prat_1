import { Client, credenciais } from "../database/postgresPersistence";
import { Usuario } from "../entities/user";
import bcrypt from 'bcrypt';

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
    

    public async entrar(usuario: Usuario){
        const clientePg = new Client(credenciais);

        await clientePg.connect();

        const textoEncontrar = 'SELECT * FROM usuario WHERE usuario_email = $1';
        const valorEncontrar = [usuario.email];

        const usuarioEncontrado = await clientePg.query(textoEncontrar, valorEncontrar);


        await clientePg.end();

        if(usuarioEncontrado.rows.length == 0){
            throw new Error("Conta não encontrada.");
        }

        if(!usuarioEncontrado.rows[0]['conta_ativa']){
            throw new Error("Conta não ativada.");
        }

        if(!bcrypt.compareSync(usuario.senha, usuarioEncontrado.rows[0]['usuario_senha'])){
            throw new Error("Senha inválida.");
        }

        const dadosUsuario = usuarioEncontrado.rows[0];

        return {usuario: dadosUsuario};
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

    public async encontrarUsuario(email: string){
        const clientePg = new Client(credenciais);

        await clientePg.connect();

        const textoEncontrar = 'SELECT * FROM usuario WHERE usuario_email = $1';
        const valorEncontrar = [email];

        const resultado = await clientePg.query(textoEncontrar, valorEncontrar);

        await clientePg.end();

        const usuarioEncotrado = resultado.rows[0];

        return usuarioEncotrado;
    }

    public async encontrarPorTelefone(telefone: string){
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoEncontrarTelefone = 'SELECT * FROM usuario WHERE usuario_telefone = $1'
        const valorEncontrarTelefone = [telefone];

        const resultadoTelefone = await clientePg.query(textoEncontrarTelefone, valorEncontrarTelefone);

        return resultadoTelefone.rows[0];
    }

}