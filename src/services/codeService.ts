import { RepositoryCodigo } from "../repositories/codeRepository";

export class ServiceCodigo{
    private repositorioCodigo: RepositoryCodigo;

    constructor(repositoryCodigo: RepositoryCodigo){
        this.repositorioCodigo = repositoryCodigo;
    }

    public async gerarCodigoEmail(email: string){
        const codigo = (Math.floor(Math.random() * 99999) + 10000).toString();
        const iat = Date.now().toString();

        await this.repositorioCodigo.registrarCodigoEmail(email, codigo, iat);

        return codigo;
    }

    public async verificarCodigoEmail(email: string, codigo: number){
        const agora = Date.now();
        const codigoString = codigo.toString();

        const ativacaoEncontrado = await this.repositorioCodigo.verificarCodigoEmail(email, codigoString);

        if(ativacaoEncontrado == undefined){
            throw new Error("Código inválido.");
        }
        const iatEncontrado = ativacaoEncontrado['iat'];

        if(agora - Number(iatEncontrado) > 7200000){
            throw new Error("Código expirado.");
        }

        return true;
    }

    public async gerarCodigoSMS(telefone: number){

        const telefoneString = telefone.toString();

        const codigo = (Math.floor(Math.random() * 99999) + 10000).toString();
        const iat = Date.now().toString();

        await this.repositorioCodigo.registrarCodigoSMS(telefoneString, codigo, iat);

        return codigo;
    }

    public async verificarCodigoSMS(telefone: number, codigo: number){

        const agora = Date.now();
        const codigoString = codigo.toString();
        const telefoneString = telefone.toString();

        const resultado = await this.repositorioCodigo.verificarCodigoSMS(telefoneString, codigoString);

        if(resultado == undefined){
            throw new Error("Código e/ou telefone inválido.");
        }
        const iatEncontrado = resultado['iat'];

        if(agora - Number(iatEncontrado) > 7200000){
            throw new Error("Código expirado.")
        }

        return true;
    }
}