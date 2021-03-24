const bcrypt = require("bcrypt");

exports.createHash = (password) => {
    // let hashPromise = new Promise((resolve, reject) => {
    //   bcrypt.hashSync(password, 10, (err, result) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve(result);
    //     }
    //   });
    // });
    // return hashPromise;
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

//   $2b$10$EBaG24EQN85OYsKd5WzoCeyQGAjJwaTmSBBStY8uv9Don7EgVLYUm