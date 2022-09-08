import { Client, credenciais } from "../database/postgresPersistence";
import jwt,  {JwtPayload} from "jsonwebtoken";
import 'dotenv/config';

export class RepositoryToken{
    public async salvar(email: string, iat: string, refreshToken: string):Promise<boolean>{
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoEncontrar = "SELECT * FROM usuariotoken WHERE usuario_email = $1";
        const valorEncontrar = [email];

        const usuarioEncontrado = await clientePg.query(textoEncontrar, valorEncontrar);

        if(usuarioEncontrado.rows.length == 0){
            const textoInserir = `
                INSERT INTO usuariotoken (usuario_email, iat, refreshtoken)
                VALUES ($1, $2, $3)
            `;

            const valoresInserir = [email, iat.toString(), refreshToken];

            await clientePg.query(textoInserir, valoresInserir);

            await clientePg.end();
        }else{
            const textoAtualizar = `
                UPDATE usuariotoken SET iat = $1, refreshtoken = $2 WHERE usuario_email = $3
            `;

            const valoresAtualizar = [iat.toString(), refreshToken, email]

            await clientePg.query(textoAtualizar, valoresAtualizar);

            await clientePg.end();
        }

        return true;
    }

    public async verificarAccessToken(email: string):Promise<string>{
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoEncontrar = "SELECT * FROM usuariotoken WHERE usuario_email = $1";
        const valoresEncontrar = [email];

        const usuarioEncontrado = await clientePg.query(textoEncontrar, valoresEncontrar);

        await clientePg.end();

        const iatEncontrado = usuarioEncontrado.rows[0]['iat'];

        return iatEncontrado as string;
    }

    public async verificarRefreshToken(email: string):Promise<string>{
        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoEncontrar = "SELECT * FROM usuariotoken WHERE usuario_email = $1";
        const valorEncontrar = [email];

        const usuarioEncontrado = await clientePg.query(textoEncontrar, valorEncontrar);

        await clientePg.end();

        const tokenEncontrado = usuarioEncontrado.rows[0]['refreshtoken'];

        return tokenEncontrado as string;
    }

    
    
}