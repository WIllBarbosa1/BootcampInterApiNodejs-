import express from 'express';
import jwtAuthenticationMiddleware from './middlewares/jwt-authentication.middleware';
import errorHandler from './middlewares/error-handler.middlewares';
import authorizationRouter from './routes/authorization.route';
import statusRouter from './routes/status.route';
import usersRoute from './routes/users.route';

const app = express();

//Configurações da aplicação
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//Configurações de Rotas
app.use(statusRouter);
app.use(authorizationRouter);

app.use(jwtAuthenticationMiddleware);
app.use(usersRoute);

//Configuração dos hadles de Erro
app.use(errorHandler);

//Inicialização do servidor
app.listen(3000, () => {
    console.log('Aplicação executando na porta 3000');
});
