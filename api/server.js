const express = require("express");
const sessions = require("express-session");
const knexSessionStore = require("connect-session-knex")(sessions); //stores sessions in database

// must be done right after the session to be able to connect

const apiRouter = require("./api-router.js");
const configuredMiddleware = require("./configuredMiddleware");
const knex = require("../data/dbConfig.js");

const server = express();

//session start
const sessionConfiguration = {
  //sessions storage options
  name: "chocolatechip", // default would be sid
  secret: "keep it secret, keep it safe!", //use for encryption must be an environment variable//cookie option
  saveUninitialized: true, // if true GDPR laws applies
  resave: false, // tells the server do not save the session again

  //how to store sessions
  store: new knexSessionStore({
    //do not forget the new
    knex, // import from db config file
    createtable: true,
    clearInterval: 1000 * 60 * 10, // checks the session every 10 min
    sidfieldname: "sid",

    //optional
    tablename: "sessions",
  }),

  cookie: {
    maxAge: 1000 * 60 * 10, //10 mins in millisec
    secure: false, // if false the cookie is sent over http if true over https. should be set to true in production
    httpOnly: true, // if true javascript cannot access the cookie to steal it
  },
};
//session end

configuredMiddleware(server);

server.use(sessions(sessionConfiguration)); // this will add a req.session

server.use("/api", apiRouter);

module.exports = server;
