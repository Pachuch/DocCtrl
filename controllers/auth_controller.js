const dbService = require('./db_service');

const rootDir = __dirname.substring(0, __dirname.length - 12);
const cookieOptions = { maxAge: 3 * 24 * 60 * 60, httpOnly: false, secure: false }

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
			const userString = JSON.stringify({
				UserID: user.UserID,
				Username: user.Username,
				Email: user.Email,
				Fullname: user.Fullname,
				Position: user.Position,
				Phone: user.Phone,
				RegistrationDate: user.RegistrationDate
			});

			request.session.userData = userString;
			response.cookie('user', userString, cookieOptions);
			response.redirect('/home');
		} else {
			response.redirect('/login');
		}
	})
    .catch(err => console.log(err));
}

const signup = (request, response) => {
	const db = dbService.getDbServiceInstance();
	const results = db.matchUser(request.body);
    results
    .then(data => {
		const user = data.find(user => user.Email === request.body.Email);

		if (!user) {

			const body = { ...request.body, Access: "user", RegistrationDate: new Date().toJSON().slice(0, 10)};

			const result_insert = db.insert("User", body);
			result_insert
			.then(() => response.redirect('/home'))
			.catch(err => console.log(err));
			
		} else {
			response.send(response.json({ message: "User is already exists"}));
		}
	})
    .catch(err => console.log(err));
}

const logout = (request, response) => {
	request.session.destroy();
	response.clearCookie("sid");
    response.redirect('/');
}

module.exports = {
    logging,
    signingup,
    login,
    signup,
	logout
};

// local middlewares
