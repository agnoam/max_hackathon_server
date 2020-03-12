import { Application, Request, Response } from "express";
import { appRouter } from '../routes/app.routes';
import { CoriunderRequests } from "../controllers/coriunder.controller";
import { ResponseStatus } from "../utils/consts";

console.log("import routes.config");

export const RoutesConfig = (app: Application) => {
    // Define the api to where go
    app
        .use('/app', appRouter)

        .get('/coriunder', async (req: Request, res: Response) => {
            try {
                const cred = await CoriunderRequests.login({ email: "arbfgel@gmail.com", password: "aabb1122" });
                const resData = await CoriunderRequests.GetCustomer(cred);

                return res.json(resData);
            } catch(ex) {
                return res.status(ResponseStatus.InternalError).json({ description: ex });
            }
        })
        .get('/', (req: Request, res: Response) => {
            res.send('node-ts server is running ;)');
        })
        .get('/getBalance', async (req: Request, res: Response) => {
            try {
                const cred = await CoriunderRequests.login({ email: "arbfgel@gmail.com", password: "aabb1122" });
                const resData = await CoriunderRequests.GetBalance(cred);
                
                return res.json(resData);
            } catch(ex) {
                return res.status(ResponseStatus.InternalError).json({ description: ex });
            }
        });
}
