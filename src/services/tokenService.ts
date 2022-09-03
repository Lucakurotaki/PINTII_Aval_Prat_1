import { RepositoryToken } from "../repositories/tokenRepository";
import jwt, {JwtPayload} from 'jsonwebtoken';

export class ServiceToken{
    private repositorio: RepositoryToken;

    constructor(repositoryToken: RepositoryToken){
        this.repositorio = repositoryToken;
    }

    public async salvar(email: string){
        const iat = Date.now().toString();

        const accessToken = jwt.sign({email: email, tokeniat: iat}, process.env.JWT_SECRET!, {expiresIn: 60});
        const refreshToken = jwt.sign({email: email}, process.env.JWT_SECRET!, {expiresIn: 120});

        await this.repositorio.salvar(email, iat, refreshToken);

        return {accessToken, refreshToken};
    }

    public async verificarRefreshToken(token: string){
        const {email} = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        if(!{email}){
            throw new Error("Token expirado.");
        }

        const tokenEncontrado = await this.repositorio.verificarRefreshToken(email);

        if(tokenEncontrado != token){
            throw new Error("Token revogado.");
        }

        return email;
    }

    public async verificarAccessToken(token: string){
        const {email, tokeniat} = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        if(!{email, tokeniat}){
            throw new Error('Token Expirado.');
        }

        const iatEncontrado = await this.repositorio.verificarAccessToken2(email);

        if(iatEncontrado != (tokeniat!.toString())){
            throw new Error("Token revogado.");
        }

        return email;
    }


}