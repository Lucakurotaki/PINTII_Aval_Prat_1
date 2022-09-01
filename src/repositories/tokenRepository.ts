import { Client, credenciais } from "../database/postgresPersistence";
import jwt,  {JwtPayload} from "jsonwebtoken";
import 'dotenv/config';

export class RepositorioAutentToken{
    public async salvar(email: string){
        const iat = Date.now();

        const accessToken = jwt.sign({email: email, tokeniat: iat}, process.env.JWT_SECRET!, {expiresIn: 60});
        const refreshToken = jwt.sign({email: email}, process.env.JWT_SECRET!, {expiresIn: 120});


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
                UPDATE usuariotoken SET iat = $1, refreshtoken = $2 WHERE usuario_email = $2
            `;

            const valoresAtualizar = [iat.toString(), refreshToken, email]

            await clientePg.query(textoAtualizar, valoresAtualizar);

            await clientePg.end();
        }

        return {accessToken, refreshToken};
    }

    public async verificarAccessToken(token: string){
        const {email, tokeniat} = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        if(!{email, tokeniat}){
            throw new Error('Token Expirado.');
        }

        const clientePg = new Client(credenciais);
        await clientePg.connect();

        const textoEncontrar = "SELECT * FROM usuariotoken WHERE usuario_email = $1";
        const valoresEncontrar = [email];

        const usuarioEncontrado = await clientePg.query(textoEncontrar, valoresEncontrar);

        await clientePg.end();

        const iatEncontrado = usuarioEncontrado.rows[0]['iat'];

        if(iatEncontrado != (tokeniat!.toString())){
            throw new Error("Token revogado.");
        }

        return email;
    }
}