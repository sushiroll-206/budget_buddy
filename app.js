import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

// // for sessions and azure auth
// import sessions from 'express-session';
// import WebAppAuthProvider from 'msal-node-wrapper'
//
// const authConfig = {
//     auth: {
//         clientId: "Client ID or Application ID HERE",   // Client ID or Application ID HERE
//         authority: "https://login.microsoftonline.com/Paste_the_Tenant_directory_ID_Here",  // https://login.microsoftonline.com/Paste_the_Tenant_directory_ID_Here
//         clientSecret: "Client or Application secret here (NOT THE 'secret id', but the 'secret value')",   // Client or Application secret here (NOT THE 'secret id', but the 'secret value')
//         redirectUri: "/redirect" // or if it doesnt work, "https://CustomDomain.me/redirect"
//     },
//     system: {
//         loggerOptions: {
//             loggerCallback(loglevel, message, containsPii) {
//                 console.log(message);
//             },
//             pliLoggingEnabled: false,
//             logLevel: 3,
//         }
//     }
// };

import apiRouter from './routes/api/v1/apiv1.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

// // middleware to add mongoose models to req
// app.use((req, res, next) => {
//     req.models = models
//     next()
// })

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// // authentication
// const oneDay = 1000 * 60 * 60 * 24
// app.use(sessions({
//     secret: "pl,okmijnuhbygvtfcrdxeszwaq;1j2h3g4f5d6d7s8a9;",
//     saveUninitialized: true,
//     cookie: {maxAge: oneDay},
//     resave: false
// }))
//
// const authProvider = await WebAppAuthProvider.WebAppAuthProvider. initialize(authConfig);
// app.use(authProvider.authenticate());
//
// app.use((req, res, next) => {
//     console.log("session info:", req. session)
//     next();
// })

// app.get(
//     '/signin',
//     (req, res, next) => {
//         return req.authContext.login({
//             postLoginRedirectUri: "/", // redirect here after login
//         }) (req, res, next);
//     }
// );
//
// app.get(
//     '/signout',
//     (req, res, next) => {
//         return req.authContext.logout ({
//             postLogoutRedirectUri: "/", // redirect here after logout
//         }) (req, res, next);
//     }
// );
//
// /**
//  * This error handler is needed to catch interaction_required errors thrown by MSAL.
//  * Make sure to add it to your middleware chain after all your routers, but before any other 
//  * error handlers.
//  */
//
// app.use(authProvider.interactionErrorHandler());

app.use('/api/v1', apiRouter);

export default app;
