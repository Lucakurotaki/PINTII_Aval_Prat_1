import { Client, credenciais } from "../database/postgresPersistence";

export class RepositoryAtivacao{

    public async registrarCodigoEmail(email: string, codigo: string, iat: string){
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoInserir = `
            INSERT INTO ativacao (email, codigo, iat)
            VALUES ($1, $2, $3)
        `;

        const valoresInserir = [email, codigo, iat.toString()];

        await clientePg.query(textoInserir, valoresInserir);

        await clientePg.end();

        return true;
    }

    public async verificarCodigoEmail(email: string, codigo: string){
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoEncontrar = 'SELECT * FROM ativacao WHERE email = $1 AND codigo = $2'
        const valoresEncontrar = [email, codigo];

        const resultadoEncontrado = await clientePg.query(textoEncontrar, valoresEncontrar);

        return resultadoEncontrado.rows[0];
    }

    public async registrarCodigoSMS(telefone: string, codigo: string, iat: string){
        const clientePg = new Client(credenciais);
        await clientePg.connect();
        
        const textoInserir = `
            INSERT INTO codigotelefone (telefone, codigo, iat)
            VALUES ($1, $2, $3)
        `;

        const valoresInserir = [telefone, codigo, iat];

        await clientePg.query(textoInserir, valoresInserir);

        await clientePg.end();

        return true;
    }

    public async verificarCodigoSMS(telefone: string, codigo: string){
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoEncontrar = 'SELECT * FROM codigotelefone WHERE telefone = $1 AND codigo = $2'
        const valoresEncontrar = [telefone, codigo];

        const resultadoEncontrado = await clientePg.query(textoEncontrar, valoresEncontrar);

        return resultadoEncontrado.rows[0];
    }

    
}