/************* Moduls **************/
import bodyParser from "body-parser";
import express from "express";
import os from "os";
import { ServerMiddleware } from "./middlewares/app.middleware";
import { RoutesConfig } from "./config/routes.config";
import { DBDriver } from "./config/mongo.config";
// import { initializeFirebase } from './config/firebase.config';

const app: express.Application = express();
const port: number = +process.env.PORT || 8810; // + means cast to number type in typescript

// Get the server's local ip
const ifaces: NetworkInterface = os.networkInterfaces();
let localIP: string;

Object.keys(ifaces).forEach((ifname) => {
  let alias: number = 0;

  ifaces[ifname].forEach((iface) => {
    if ("IPv4" !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias < 1) {
      localIP = iface.address;
    }
    ++alias;
  });
});


/****************** Configs ******************/
DBDriver.connect();
// initializeFirebase();
/**************** Middelwares ****************/
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );
app.use( ServerMiddleware );
/******************** API ********************/
RoutesConfig(app);
/*********************************************/

app.listen(port, () => {
  console.log(`Our app server is running on http://${os.hostname()}:${port}`);
  console.log(`Server running on: http://${localIP}:${port}`);
});

interface NetworkInterface {
  [index: string]: os.NetworkInterfaceInfo[];
}

// ignore this for now. this is for mock data insertion
/*
var fs = require('fs');
var users = JSON.parse(fs.readFileSync('data\\users.json', 'utf8'));
var accounts = JSON.parse(fs.readFileSync('data\\accounts.json', 'utf8'));
var transactions = JSON.parse(fs.readFileSync('data\\transactions.json', 'utf8'));

import { UserModel, IUser } from './models/user.model';
import { TransactionModel } from './models/transaction.model';
import { AccountModel, IAccount } from './models/account.model';
import { Types } from "mongoose";

async function update():Promise<void> {
  setTimeout(() => {
    for(let i = 0; i < 200; ++i) {
      const user = {
        username: users[i].username,
        password: users[i].password,
        accountIds: users[i].accountId,
        email: users[i].email,
        name: users[i].name,
        profileImage: users[i].profileImage,
        lastConnected: users[i].lastConnected
      };
      UserModel.collection.insert(user);
    }
    let userI = 0;
    let accountI = 0;
    for(let i = 0; i < 201; ++i) {
      let accountId;
      if(users[userI].accountId[accountI]) {
        accountId = users[userI].accountId[accountI];
        ++accountI;
      } else {
        accountI = 0;
        ++userI;
        accountId = users[userI].accountId[accountI];
        ++accountI;
      }
      const account = {
        _id: Types.ObjectId(accountId),
        balance: accounts[i].balance,
        secretCode: accounts[i].secretCode,
        transactionIds: accounts[i].transactionIds
      };
      AccountModel.collection.insert(account);
    }
    accountI = 0;
    let transactionI = 0;
    for(let i = 0; i < 200; ++i) {
      let transactionId;
      if(accounts[accountI].transactionIds[transactionI]) {
        transactionId = accounts[accountI].transactionIds[transactionI];
        ++transactionI;
      } else {
        transactionI = 0;
        ++accountI;
        transactionId = accounts[accountI].transactionIds[transactionI];
        ++transactionI;
      }
      // there is no an account with such transactionId before this one
      if(accounts.indexOf(accounts.find(account => (account.transactionIds.indexOf(transactionId)  !== -1 ) ) ) === accountI) {
        const transaction = {
          _id:      Types.ObjectId(transactionId),
          srcAcc:   transactions[i].srcAcc,
          destAcc:  transactions[i].destAcc,
          category: transactions[i].category,
          amount:   transactions[i].amount
        };
        TransactionModel.collection.insert(transaction);
      }
    }
  }, 5000);
}

// update();
*/