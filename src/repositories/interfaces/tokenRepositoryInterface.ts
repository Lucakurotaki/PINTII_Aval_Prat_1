export interface InterfaceRepositoryToken{
    salvar(email: string, iat: string, refreshToken: string):Promise<boolean>;
    verificarAccessToken(email: string):Promise<string>;
    verificarRefreshToken(email: string):Promise<string>;
}