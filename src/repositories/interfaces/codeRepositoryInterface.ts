import { Ativacao } from "../../entities/ativacao";
import { CodigoTelefone } from "../../entities/codigoTelefone";

export interface InterfaceRepositoryCodigo{
    registrarCodigoEmail(email: string, codigo: string, iat: string):Promise<boolean>;
    verificarCodigoEmail(email: string, codigo: string):Promise<Ativacao>;
    registrarCodigoSMS(telefone: string, codigo: string, iat: string): Promise<boolean>;
    verificarCodigoSMS(telefone: string, codigo: string): Promise<CodigoTelefone>;
}