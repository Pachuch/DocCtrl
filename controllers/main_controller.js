// const express = require("express");
// const session = require("express-session");
// const cors = require('cors');
// const dotenv = require('dotenv');
// const multer = require('multer');
// const uuid = require('uuid').v4;
// const fs = require('fs');

const rootDir = __dirname.substring(0, __dirname.length - 12);

const account = (request, response) => {
    response.sendFile(rootDir + "/views/account.html");
}

const administration = (request, response) => {
    response.sendFile(rootDir + "/views/administration.html");
}

const docview = (request, response) => {
    response.sendFile(rootDir + "/views/docview.html");
}

const editing = (request, response) => {
    response.sendFile(rootDir + "/views/editing.html");
}

const index = (request, response) => {
    response.sendFile(rootDir + "/views/index.html");
}

const login = (request, response) => {
    response.sendFile(rootDir + "/views/login.html");
}

const register = (request, response) => {
    response.sendFile(rootDir + "/views/register.html");
}

const report_view = (request, response) => {
    response.sendFile(rootDir + "/views/report_view.html");
}

module.exports = {
    account,
    administration,
    docview,
    editing,
    index,
    login,
    register,
    report_view
};