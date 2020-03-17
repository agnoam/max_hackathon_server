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
                // email: kobimiz2001@gmail.com, pincode: 1310, password: 7Vl3jD2R, accountId: 4776545
                // email: arbfgel@gmail.com, pincode: 1310, password: aabb1122 accountId: 7950024
                const cred = await CoriunderRequests.login({ email: req.body.email, password: req.body.password });
                const resData = await CoriunderRequests.GetCustomer(cred);

                return res.json(resData);
            } catch(ex) {
                return res.status(ResponseStatus.InternalError).json({ description: ex });
            }
        })
        .get('/', (req: Request, res: Response) => {
            res.send('node-ts server is running ;)');
        });
}
