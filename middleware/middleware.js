// app.use((request, response, next) => {
//   const { userId } = request.session;
//   if (userId) {
//     response.locals.user = users.find(user => user.id === userId);
//   }
//   next();
// })

module.exports = (request, response, next) => {
    const { userId } = request.session;
    if (userId) {
        response.locals.user = users.find(user => user.id === userId);
    }
    next();
};