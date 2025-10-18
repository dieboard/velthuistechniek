const bcrypt = require('bcryptjs');

// In a real application, you would use a more secure way to store the password hash,
// such as environment variables or a secure configuration service.
// For this example, we'll store it in this file.

// To generate a new hash, use the following code:
// const salt = bcrypt.genSaltSync(10);
// const hash = bcrypt.hashSync("YOUR_PASSWORD_HERE", salt);
// console.log(hash);

const passwordHash = "$2a$10$7cvLA7o3Tf3DfXkUv7TL1OWQorxzoDNbbe0JN5EL00szAN9sne89u"; // admin

module.exports = {
  passwordHash
};