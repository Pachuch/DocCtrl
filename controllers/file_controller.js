
const { compare } = require('bcrypt');
const fs = require('fs');

const rootDir = __dirname.substring(0, __dirname.length - 12);

const upload = (request, response) => {
    return response.json({ file: response.req.file.filename });
}

const download = (request, response) => {
  const path = "uploads\\" + request.params.path;
  return response.download(path);
}

const delete_record_file = (request, response) => {
    const path = "uploads\\" + request.query.fileName;

    try {
      fs.unlinkSync(path)
    } catch(err) {
      console.error(err)
    }
  
    return response.json( { status: "OK"} );
}

module.exports = {
    upload,
    download,
    delete_record_file
};