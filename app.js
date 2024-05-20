import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session';
import WebAppAuthProvider from 'msal-node-wrapper'
// To install msal-node-wrapper, run:
//     npm install https://gitpkg.now.sh/kylethayer/ms-identity-javascript-nodejs-tutorial-msal-node-v2-/Common/msal-node-wrapper?main

// // for sessions and azure auth
//
const authConfig = {
    auth: {
   	clientId: "7f5aacfa-a950-4748-9120-94ac5d7c7149",
    	authority: "https://login.microsoftonline.com/f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
    	clientSecret: "gxL8Q~ynHSo~WAfkLLoW2XpOO2b6ueg-CpqBidyD",
    	redirectUri: "/redirect"
    },
	system: {
    	loggerOptions: {
        	loggerCallback(loglevel, message, containsPii) {
            	console.log(message);
        	},
        	piiLoggingEnabled: false,
        	logLevel: 3,
    	}
	}
};

import apiRouter from './routes/api/v1/apiv1.js';
import models from './models.js';
import usersRouter from './routes/api/v1/controllers/users.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// // middleware to add mongoose models to req
app.use((req, res, next) => {
    req.models = models
    next()
})

// authentication
const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: "pl,okmijnuhbygvtfcrdxeszwaq;1j2h3g4f5d6d7s8a9;",
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}))

const authProvider = await WebAppAuthProvider.WebAppAuthProvider. initialize(authConfig);
app.use(authProvider.authenticate());

app.use((req, res, next) => {
    console.log("session info:", req. session)
    next();
})

app.use('/users', usersRouter)

// use this by going to urls like: 
// http://localhost:3000/fakelogin?name=anotheruser
app.get('/fakelogin', (req, res) => {
    let newName = req.query.name;
    let session=req.session;
    session.isAuthenticated = true;
    if(!session.account){
        session.account = {};
    }
    session.account.name = newName;
    session.account.username = newName;
    console.log("set session");
    res.redirect("/api/v1/users/myIdentity");
});

// use this by going to a url like: 
// http://localhost:3000/fakelogout
app.get('/fakelogout', (req, res) => {
    let newName = req.query.name;
    let session=req.session;
    session.isAuthenticated = false;
    session.account = {};
    console.log("you have fake logged out");
    res.redirect("/api/v1/users/myIdentity");
});

app.get(
    '/signin',
    (req, res, next) => {
        return req.authContext.login({
            postLoginRedirectUri: "/", // redirect here after login
        }) (req, res, next);
    }
);

app.get(
    '/signout',
    (req, res, next) => {
        return req.authContext.logout ({
            postLogoutRedirectUri: "/", // redirect here after logout
        }) (req, res, next);
    }
);

/**
 * This error handler is needed to catch interaction_required errors thrown by MSAL.
 * Make sure to add it to your middleware chain after all your routers, but before any other 
 * error handlers.
 */

app.use(authProvider.interactionErrorHandler());

app.use('/api/v1', apiRouter);

export default app;
