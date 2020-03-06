import { Application, Request, Response } from "express";
import { appRouter } from '../routes/app.routes';
import { MaxRequests } from "../controllers/max.controller";

console.log("import routes.config");

export const RoutesConfig = (app: Application) => {
    // Define the api to where go
    app
        .use('/app', appRouter)

        .get('/max-try', (req: Request, res: Response) => {
            MaxRequests.accountAdd({ AccountId: 62525652626659, Currency: '' });
        })
        .get('/', (req: Request, res: Response) => {
            res.send('node-ts server is running ;)');
        });
}
