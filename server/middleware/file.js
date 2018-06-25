const multer = require('multer');
// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, '/tmp/documents')
//     },
//     filename: (req, file, callback) => {
//         callback(null, file.fieldname + '-' + Date.now())
//     }
// });
const storage = multer.memoryStorage();
const upload = multer({storage});

module.exports = upload;