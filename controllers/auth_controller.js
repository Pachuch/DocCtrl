const dbService = require('./db_service');

const rootDir = __dirname.substring(0, __dirname.length - 12);

const logging = (request, response) => {
    // request.session.userId = 0;

    // response.json({
    //     data: request.session.userId ? true : false
    // });
    response.sendFile(rootDir + "/views/login.html");
}

const signingup = (request, response) => {
    response.sendFile(rootDir + "/views/register.html");
}

const login = (request, response) => {

	const db = dbService.getDbServiceInstance();

	const results = db.matchUser(request.body);
    results
    .then(data => {
		const user = data.find(user => user.Email === request.body.Email && user.Password === request.body.Password);

		if (user) {
			request.session.user = JSON.stringify({ UserID: user.UserID, Username: user.Username});
			response.redirect('/home');
		}
	})
    .catch(err => console.log(err));
}

const signup = (request, response) => {
	console.log(request.body);
	response.redirect("/home");
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
    signingup,
    login,
    signup
};

// local middlewares
