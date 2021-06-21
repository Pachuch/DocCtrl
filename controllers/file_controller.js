
const fs = require('fs');

const rootDir = __dirname.substring(0, __dirname.length - 12);

const upload = (request, response) => {
    return response.json({ file: response.req.file });
}

const delete_record_file = (request, response) => {
    const path = request.query.fileName;

    try {
      fs.unlinkSync(path)
    } catch(err) {
      console.error(err)
    }
  
    return response.json( { status: "OK"} );
}

module.exports = {
    upload,
    delete_record_file
};