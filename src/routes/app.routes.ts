import { Router } from "express";
import { AppCtrl } from '../controllers/app.controller';

console.log("import app.routes");

// The node.js simple code here
export const appRouter: Router = Router();

// The post port like this
appRouter
  .post('/sign-up', AppCtrl.signUp_R)
  .post('/login', AppCtrl.login_R);
  // .post('/sign-up', AppCtrl.signUp_R)
  // .post('/post', AppCtrl.doPost_R)
  // .post('/transferMoney', AppCtrl.transferMoney_R)
  // .post('/getAccount', AppCtrl.getAccount_R); // todo: remove this. this is for debugging
