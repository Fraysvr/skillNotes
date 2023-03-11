const { createHash } = require("crypto");

const hash = (pass) => createHash("sha256").update(pass).digest("hex");

module.exports = hash;
