const User = require("../models/user.model");
const { generateJwtToken } = require("../utils");

class AuthService {
  async registerUser(body) {
    const user = await User.create({ ...body });
    if (user) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        jobTitle: user.jobTitle,
        organisation: user.organisation,
        ...this.IssueToken(user),
      };
    }
  }

  async findUserByEmail(email) {
    const user = await User.findOne({ email })
    return user;
  }

  async findUserById(userId) {
    return await User.findOne({ _id: userId })
  }

  async changeUserPassword(userId, newPassword){
     const user = await this.findUserById(userId)
     user.password = newPassword
     return await user.save()
  }

  async updateUserDetails(userId, userDetails) {
    return await User.findByIdAndUpdate(userId, userDetails, {
      new: true,
    }).select(["-password", "-__v"]);
  }

  async fetchAllUsers() {
    return await User.find().select(["-password", "-__v"]);
  }

  IssueToken(user) {
    return {
      token: generateJwtToken({
        id: user._id,
        email: user.email,
      }),
    };
  }
}

const AuthUserService = new AuthService();

module.exports = { AuthUserService };
