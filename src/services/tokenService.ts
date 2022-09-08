import jwt, {JwtPayload} from 'jsonwebtoken';
import { Tokens } from "../entities/tokens";
import { InterfaceRepositoryToken } from "../repositories/interfaces/tokenRepositoryInterface";

export class ServiceToken{
    private repositorio: InterfaceRepositoryToken;

    constructor(repositoryToken: InterfaceRepositoryToken){
        this.repositorio = repositoryToken;
    }

    public async salvar(email: string){
        const iat = Date.now().toString();

        const accessToken = jwt.sign({email: email, tokeniat: iat}, process.env.JWT_SECRET!, {expiresIn: '5m'});
        const refreshToken = jwt.sign({email: email}, process.env.JWT_SECRET!, {expiresIn: '10m'});

        await this.repositorio.salvar(email, iat, refreshToken);

        return {accessToken, refreshToken} as Tokens;
    }

    public async verificarRefreshToken(token: string):Promise<string>{
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

    public async verificarAccessToken(token: string):Promise<string>{
        const {email, tokeniat} = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        if(!{email, tokeniat}){
            throw new Error('Token Expirado.');
        }

        const iatEncontrado = await this.repositorio.verificarAccessToken(email);

        if(iatEncontrado != (tokeniat!.toString())){
            throw new Error("Token revogado.");
        }

        return email;
    }


}