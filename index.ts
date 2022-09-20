import express from 'express';
import rotas from './src/routes';

import { errors } from 'celebrate';

const app = express();

app.use(express.json());
app.use(rotas);
app.use(errors());

app.listen(3000, ()=>{
    console.log("O aplicativo está rodando na porta 3000.");
});