import { Request, Response } from "express";
import { ResponseStatus } from "../utils/consts";
import { UserModel, IUser } from '../models/user.model';
import { MessageModel, IMessage, Action } from '../models/message.model';
import { AccountModel, IAccount } from './../models/account.model';
import { DocumentQuery } from "mongoose";
import md5 from 'md5';

// Required imports for firebase to function properly
// import { db } from '../config/firebase.config';
// import { database } from "firebase-admin";
// import { User } from '../models/user.model';
// import { userDefaultImage } from '../models/user.model';

console.log("import app.controller");

export module AppCtrl {
    export function doPost_R(req: Request, res: Response): Response {
        return res.status(ResponseStatus.Ok).json({
            date: Date.now(),
            description: 'This is the date right now'
        });
    }

    export async function login_R(req: Request, res: Response): Promise<Response> {
        const reqBody: LoginRequestBody = req.body;
        if(reqBody.username && reqBody.password) {
            try {
                let userData: IUser = await isLegit(reqBody.username, reqBody.password);                
                if(userData) {
                    await userData.updateOne({ lastConnected: Date.now() }).exec();
                    return res.status(ResponseStatus.Ok).json({ auth: true, user: deleteSecretData(userData) });
                } else {
                    return res.status(ResponseStatus.Ok).json({ auth: false, description: "Username isn't exists" });
                }
            } catch(ex) {
                console.error(ex);
            }
        }

        return res.status(ResponseStatus.BadRequest).json({
            description: 'Request must have username and password fields in body'
        });
    }

    export async function signUp_R(req: Request, res: Response): Promise<Response> {
        const userData = {
            username: req.body.username,
            password: md5(req.body.password),
            email: req.body.email,
            name: req.body.name
        }

        if(userData.username && userData.password && userData.email && userData.name) {
            const userExists: UserExists = await isUserExists({ username: userData.username, email: userData.email });
            try {
                if(userExists === UserExists.Not) {
                    await UserModel.create(userData);
                    return res.status(ResponseStatus.Ok).json({ description: 'User created successfuly' });
                } else if(userExists === UserExists.Email) {
                    return res.status(ResponseStatus.Ok).json({ description: 'This email already used' });
                } else {
                    return res.status(ResponseStatus.Ok).json({ description: 'This username already used' });
                }
            } catch(ex) {
                console.error(ex);
            }
        }

        return res.status(ResponseStatus.InternalError).json({ description: 'Operation failed, please try again' });
    }

    export async function deleteUser_R(req: Request, res: Response): Promise<Response> {
        const userData: LoginRequestBody = req.body;

        try {
            if(await isLegit(userData.username, userData.password)) {
                UserModel.remove({ username: userData.username });
                return res.status(ResponseStatus.Ok).json({
                    description: 'User deleted successfuly'
                });
            }
            
            return res.status(ResponseStatus.Ok).json({ 
                description: 'User credentials is not accurte, Please change and try again'
            });
        } catch(ex) {
            console.error(ex);
            return res.status(ResponseStatus.InternalError).json({
                description: 'There was an error, User delete did not happened'
            });
        }
    }

    async function isUserExists(data: { username?: string, email?: string }): Promise<UserExists> {
        let res: UserExists = UserExists.Not;
        
        try {
            // Checking existence of username
            if(data.username) {
                const matchUsers: IUser[] = await UserModel.find({ username: data.username }).exec();
                matchUsers.length > 0 ? res = UserExists.Username : null;
            }

            // Checking existence of mail
            if(data.email) {
                const matchEmails: IUser[] = await UserModel.find({ email: data.email }).exec();
                matchEmails.length > 0 ? res = UserExists.Email : null;
            }
        } catch(ex) {
            console.error(ex);
        }
        
        return res;
    }

    async function isLegit(username: string, password: string): Promise<IUser> {
        try {
            const userQuery: DocumentQuery<IUser, IUser> = UserModel.findOne({ username: username });
            const userData: IUser = await userQuery.exec();

            // Encrypting the password with md5
            if(userData.password === md5(password)) {
                return userData;
            }

            return null;
        } catch(ex) {
            console.error(`ex with querying mongodb: `, ex);
        }
    }

    function deleteSecretData(user: IUser): IUser {
        user = user.toJSON();
        delete user.password;
        delete user.__v;
        delete user._id;

        return user;
    }

    async function newMessage(message: IMessage): Promise<void> {
        try {
            await MessageModel.create(message);
        } catch(ex) {
            throw {
                description: 'MessageModel ex',
                data: ex
            }
        }
    }

    async function newAccount(account: IAccount): Promise<void> {
        try {
            await AccountModel.create(account);
        } catch(ex) {
            throw {
                description: 'AccountModel ex',
                data: ex
            }
        }
    }
}

interface LoginRequestBody {
    username: string;
    password: string;
}

enum UserExists {
    Not,
    Email,
    Username
}