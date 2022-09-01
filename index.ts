import express from 'express';
import rotas from './src/routes';

const app = express();

app.use(express.json());
app.use(rotas);

app.listen(3000, ()=>{
    console.log("O aplicativo está rodando na porta 3000.");
});