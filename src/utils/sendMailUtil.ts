import nodemailer from 'nodemailer';

export const sendMail = async (nome: string, email: string, codigo: string)=>{
    var transporte = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "5bd92feff9fe2e",
            pass: "c47e73d804de94"
        }
    });
    
    var mensagem = {
        from: "leitura@servidor.com.br",
        to: email,
        subject: "Código de ativação",
        text: `${nome}, o seu código de ativação é: ${codigo}` ,
        html: `${nome}, o seu código de ativação é: ${codigo}`
    };
    
    transporte.sendMail(mensagem, (err)=>{
        if(err) throw new Error(err.message);
    })
}