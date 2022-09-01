import { Client, credenciais } from "../database/postgresPersistence";
import { Usuario } from "../entities/user";
import bcrypt from 'bcrypt';

export class RepositorioAutent{
    
    public async registrar(usuario: Usuario){
        const clientePg = new Client(credenciais);

        await clientePg.connect();

        const textoEncontrar = 'SELECT * FROM usuario WHERE usuario_email = $1';
        const valorEncontrar = [usuario.email];

        const usuarioEncontrado = await clientePg.query(textoEncontrar, valorEncontrar);

        if(usuarioEncontrado.rows.length != 0){
            clientePg.end();

            throw new Error("Já existe uma conta com este email.");
        }

        const salt = bcrypt.genSaltSync();
        usuario.senha = bcrypt.hashSync(usuario.senha, salt);

        const textoInserir = `
            INSERT INTO usuario (usuario_nome, usuario_email, usuario_senha)
            VALUES ($1, $2, $3)
            RETURNING usuario_id
        `;

        const valoresInserir = [usuario.nome, usuario.email, usuario.senha];

        const resultado = await clientePg.query(textoInserir, valoresInserir);
        
        await clientePg.end();

        const usuarioId = resultado.rows[0]['usuario_id'];

        return {id: usuarioId};
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

        if(!bcrypt.compareSync(usuario.senha, usuarioEncontrado.rows[0]['usuario_senha'])){
            throw new Error("Senha inválida.");
        }

        const dadosUsuario = usuarioEncontrado.rows[0];

        return {usuario: dadosUsuario};
    }

    public async gerarCodigoAtiv(email: string){
        const codigo = Math.floor(Math.random() * 99999) + 10000;
        const iat = Date.now();

        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoInserir = `
            INSERT INTO ativacao (email, codigo, iat)
            VALUES ($1, $2, $3)
        `;

        const valoresInserir = [email, codigo, iat.toString()];

        await clientePg.query(textoInserir, valoresInserir);

        await clientePg.end();

        console.log("EMAIL: ", codigo);
    }

    public async ativarConta(email: string, codigo: number){
        const agora = Date.now();

        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoEncontrar = 'SELECT * FROM ativacao WHERE email = $1 AND codigo = $2'
        const valoresEncontrar = [email, codigo];

        const resultadoEncontrado = await clientePg.query(textoEncontrar, valoresEncontrar);

        if(resultadoEncontrado.rowslength == 0){
            throw new Error("Código inválido.");
        }
        const iatEncontrado = resultadoEncontrado.rows[0]['iat'];

        if(agora - Number(iatEncontrado) > 7200000){
            throw new Error("Código expirado.")
        }

        const textoAtualizar = 'UPDATE usuario SET conta_ativa = true WHERE usuario_email = $1';
        const valorAtualizar = [email];

        await clientePg.query(textoAtualizar, valorAtualizar);

        return {mensagem: "Conta ativada."}
    }

}