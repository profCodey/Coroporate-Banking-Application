const User = require("../model/user.model");

class UserService {
  async getUserById(id) {
    const user = await User.findById(id);
    return user;
  }
}

module.exports = new UserService();
