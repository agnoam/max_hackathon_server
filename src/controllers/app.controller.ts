import { Request, Response } from "express";
import { ResponseStatus } from "../utils/consts";
import { CoriunderRequests, CoriunderCred, Page } from "./coriunder.controller";

console.log("import app.controller");

export module AppCtrl {
    export async function login_R(req: Request, res: Response): Promise<Response> {
        try {
            const timeToExp: number = 14 * 60 * 1000; // 14 minutes until exp date of credentials
            const creds: CoriunderCred = 
                await CoriunderRequests.login(req.body as { email: string, password: string });
            if(creds) {
                return res.status(ResponseStatus.Ok).json({
                    auth: true,
                    cred: creds,
                    expDate: Date.now() + timeToExp
                });
            }
        } catch(ex) {
            console.error(ex);
        }
        
        return res.status(ResponseStatus.InternalError).json({
            auth: false,
            description: 'There was an error, Please try again later ?'
        });
    }

    export async function getRows_R(req: Request, res: Response): Promise<Response> {
        try {
            const rows: Page[] = await CoriunderRequests.GetRows(
                req.body.creds, 
                req.body.filters, 
                req.body.sortAndPage
            );

            if(rows) {
                return res.status(ResponseStatus.Ok).json({ data: rows });
            }
        } catch(ex) {
            console.error(ex);
        }
        
        return res.status(ResponseStatus.InternalError).json({ 
            description: 'There was an error, Please try again later' 
        });
    }

    export async function signUp_R(req: Request, res: Response): Promise<Response> {
        try {
            if(req.body.data && req.body.info) {
                const newID: number = await CoriunderRequests.RegisterCustomer({
                    data: { password: req.body.data.password, pinCode: req.body.data.pinCode },
                    info: {
                        addressLine: req.body.info.addressLine,
                        city: req.body.info.city,
                        country: req.body.info.country,
                        email: req.body.info.email,
                        firstname: req.body.info.firstname,
                        lastname: req.body.info.lastname,
                        postalCode: req.body.info.postalCode
                    }
                });    
                return res.status(ResponseStatus.Ok).json({ id: newID, description: 'Customer registered' });
            } else {
                return res.status(ResponseStatus.BadRequest).json({ description: 'Request have missing fields' });
            }
        } catch(ex) {
            console.error(ex);
        }
        return res.status(ResponseStatus.InternalError).json({ 
            description: 'There was an error, Please try again later' });
    }

    export async function transferAmount_R(req: Request, res: Response): Promise<Response> {
        const body: TransferRequestBody = {
            userCred: req.body.creds as CoriunderCred,
            destAccountId: req.body.destAccID,
            amount: req.body.amount,
            pinCode: req.body.pinCode,  // Of source user
            currencyIso: req.body.currencyIso,
            text: req.body.text
        }
        
        try {
            const isTransfered: boolean = await CoriunderRequests.TransferAmount(
                body.userCred, body.destAccountId, 
                body.amount, body.pinCode, body.currencyIso, body.text
            );

            return res.status(ResponseStatus.Ok).json({ isTransfered });
        } catch(ex) {
            console.error(ex);
            throw {
                description: 'User existence check ex',
                data: ex
            }
        }

        return res.status(ResponseStatus.InternalError).json({ 
            description: 'There was an error, Please try again later' });
    }

    export async function getBalance_R(req: Request, res: Response): Promise<Response> {
        console.log('getBalance_R executed');
        try {
            const cred: CoriunderCred = req.body.creds as CoriunderCred;
            const resData = await CoriunderRequests.GetBalance(cred);
            
            return res.status(ResponseStatus.Ok).json(resData);
        } catch(ex) {
            return res.status(ResponseStatus.InternalError).json({ description: ex });
        }
    }

    export async function getManagedAccounts_R(req: Request, res: Response): Promise<Response> {
        try {
            const cred = req.body.creds;
            const resData = await CoriunderRequests.GetManagedAccounts(cred);
            
            return res.status(ResponseStatus.Ok).json(resData);
        } catch(ex) {
            return res.status(ResponseStatus.InternalError).json({ description: ex });
        }
    }

    export async function resetPassword_R(req: Request, res: Response): Promise<Response> {
        try {
            const resData = await CoriunderRequests.Reset(req.body.email);
            return res.status(ResponseStatus.Ok).json(resData);
        } catch(ex) {
            return res.status(ResponseStatus.InternalError).json({ description: ex });
        }
    }

    export async function getTransaction_R(req: Request, res: Response): Promise<Response> {
        try {
            const resData = await CoriunderRequests.GetTransaction(req.body.id);
            
            return res.json(resData);
        } catch(ex) {
            return res.status(ResponseStatus.InternalError).json({ description: ex });
        }
    }
}

interface TransferRequestBody {
    userCred: CoriunderCred;
    destAccountId: number;
    amount: number;
    pinCode: string;
    currencyIso: string;
    text: string;
}

enum UserExists {
    Not,
    Email,
    Username
}