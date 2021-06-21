
const rootDir = __dirname.substring(0, __dirname.length - 12);

const logging = (request, response) => {
    request.session.userId = 0;

    response.json({
        data: request.session.userId ? true : false
    });
    // response.sendFile(rootDir + "/views/login.html");
}

const login = (request, response) => {
    response.sendFile(rootDir + "/views/login.html");
}

const signup = (request, response) => {
    response.sendFile(rootDir + "/views/register.html");
}

// app.get('/', (request, response) => {
//   // const user = users.find(user => user.id === request.session.userId);
//   response.sendFile(__dirname + "/views/index.html");
// });

// app.get('/login', (request, response) => {
//   // console.log(request.session);
//   request.session.userId = 0;

//   response.json({
//     data: request.session.userId ? true : false
//   });
// });

// const users = [
//   { id: 1, name: 'Alex', email: "aaa@gmail.com", password: "sercret" },
//   { id: 2, name: 'Brian', email: "bbb@gmail.com", password: "sercret" },
//   { id: 3, name: 'Mia', email: "ccc@gmail.com", password: "sercret" }
// ];

// app.post('/login', redirectHome, (request, response) => {
//   const { email, password } = request.body;

//   if (email && password) {
//     const user = users.find(user => user.email === email && user.password === password);
//     if (user) {
//       request.session.userId = user.id;
//       return response.redirect('/');
//     }
//   }

//   response.redirect('/login');

// });

// app.post('/register', redirectHome, (request, response) => {
//   const { name, email, passwird } = request.body;

//   if (name && email && password) {
//     const exists = users.some(user => user.email);

//     if (!exists) {
//       const user = {
//         id: users.length + 1,
//         name,
//         email,
//         password
//       }

//       users.push(user);

//       request.session.userId = user.id;
//       return response.redirect('/');
//     }
//   }

//   response.redirect('/register');
// });

// // sign in
// app.get('/register', (request, response) => {
//   return response.json( {status: "BAD" });
// });

// // log out
// app.post('/logout', (request, response) => {
//   request.session.destroy(err => {
//     if (err) {
//       return response.redirect('/');
//     }

//     response.clearCookie("sid");
//     response.redirect('/login');
//   })
// });

module.exports = {
    logging,
    login,
    signup
};