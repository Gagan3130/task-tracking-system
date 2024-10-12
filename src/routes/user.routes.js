const express = require("express");
const {
  userRegistrationValidator,
  userLoginValidator,
} = require("../validators/user.validator");
const {
  validateRequestSchema,
} = require("../validators/validateRequestSchema");
const {
  registerUser,
  authenticateUser,
} = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const {
  getAllUsers,
  updateUserProfile,
  changeUserPassword,
} = require("../controllers/user.controller");
const { userDetailsUpdateValidator } = require("../validators/user.validator");

const router = express.Router();
router
  .route("/signup")
  .post(userRegistrationValidator, validateRequestSchema, registerUser);
router
  .route("/login")
  .post(userLoginValidator, validateRequestSchema, authenticateUser);

router
  .route("/")
  .get(authMiddleware, getAllUsers)
  .put(
    authMiddleware,
    userDetailsUpdateValidator,
    validateRequestSchema,
    updateUserProfile
  );

router.route('/change-password').put(authMiddleware, changeUserPassword)  
module.exports = router;
