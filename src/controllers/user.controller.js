const asyncHandler = require("express-async-handler");
const { AuthUserService } = require("../services/user.service");
const { NotFoundError, ValidationError } = require("../utils/custom-error");
const errorCodes = require("../utils/error-codes");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await AuthUserService.fetchAllUsers();
  res.status(200).json(users);
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const user = await AuthUserService.findUserById(id);
  if (!user)
    throw new NotFoundError({
      message: "User not found",
      code: errorCodes.USER_NOT_FOUND,
    });
  const { name, organisation, jobTitle } = req.body;
  const updatedUser = await AuthUserService.updateUserDetails(id, {
    name,
    organisation,
    jobTitle,
  });
  res.status(200).json(updatedUser);
});

const changeUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { id } = req.user;
  const user = await AuthUserService.findUserById(id);
  if (!user)
    throw new NotFoundError({
      message: "User not found",
      code: errorCodes.USER_NOT_FOUND,
    });
  const verifyPassword = await user.comparePassword(oldPassword);
  if (!verifyPassword) {
    throw new ValidationError({
      message: "Invalid Old Password",
      code: errorCodes.VALIDATION_ERROR,
    });
  }
  const response = await AuthUserService.changeUserPassword(id, newPassword);
  if (response)
    res.status(200).json({ message: "Password changed successfully" });
});

module.exports = { getAllUsers, updateUserProfile, changeUserPassword };
