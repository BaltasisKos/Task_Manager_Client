import asyncHandler from "express-async-handler";
import Notice from "../models/notis.js";
import User from "../models/userModel.js";
import createJWT from "../utils/index.js";

// ===========================
// POST - Login User
// ===========================
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(401)
      .json({ status: false, message: "Invalid email or password." });
  }

  if (!user?.isActive) {
    return res.status(401).json({
      status: false,
      message: "User account has been deactivated, contact the administrator",
    });
  }

  const isMatch = await user.matchPassword(password);

  if (isMatch) {
    createJWT(res, user._id);

    user.password = undefined;

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      title: user.title,
      isAdmin: user.isAdmin,
    });
  } else {
    return res
      .status(401)
      .json({ status: false, message: "Invalid email or password" });
  }
});

// ===========================
// POST - Register User
// ===========================
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, title } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res
      .status(400)
      .json({ status: false, message: "Email address already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    title,
    isAdmin: role === "admin",
  });

  if (!user) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid user data" });
  }

  createJWT(res, user._id);

  user.password = undefined;

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    title: user.title,
    role: user.role,
    isAdmin: user.isAdmin,
  });
});

// ===========================
// POST - Logout User
// ===========================
const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// ===========================
// GET - Team List
// ===========================
const getTeamList = asyncHandler(async (req, res) => {
  const { search } = req.query;
  let query = {};

  if (search) {
    query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };
  }

  const users = await User.find(query).select("name title role email isActive");
  res.status(200).json(users);
});

// ===========================
// GET - Notifications List
// ===========================
const getNotificationsList = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const notice = await Notice.find({
    team: userId,
    isRead: { $nin: [userId] },
  })
    .populate("task", "title")
    .sort({ _id: -1 });

  res.status(200).json(notice);
});

// ===========================
// GET - User Task Status
// ===========================
const getUserTaskStatus = asyncHandler(async (req, res) => {
  const tasks = await User.find()
    .populate("tasks", "title stage")
    .sort({ _id: -1 });

  res.status(200).json(tasks);
});

// ===========================
// PUT - Mark Notification as Read
// ===========================
const markNotificationRead = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { isReadType, id } = req.query;

  if (isReadType === "all") {
    await Notice.updateMany(
      { team: userId, isRead: { $nin: [userId] } },
      { $push: { isRead: userId } }
    );
  } else {
    await Notice.findOneAndUpdate(
      { _id: id, isRead: { $nin: [userId] } },
      { $push: { isRead: userId } }
    );
  }

  res.status(200).json({ status: true, message: "Done" });
});

// ===========================
// PUT - Update User Profile
// ===========================
const updateUserProfile = asyncHandler(async (req, res) => {
  const { userId, isAdmin } = req.user;
  const { _id } = req.body;

  const id =
    isAdmin && userId === _id
      ? userId
      : isAdmin && userId !== _id
      ? _id
      : userId;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ status: false, message: "User not found" });
  }

  user.name = req.body.name || user.name;
  user.title = req.body.title || user.title;
  user.role = req.body.role || user.role;

  const updatedUser = await user.save();
  updatedUser.password = undefined;

  res.status(200).json({
    status: true,
    message: "Profile Updated Successfully.",
    user: updatedUser,
  });
});

// ===========================
// PUT - Activate or Disable User
// ===========================
const activateUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ status: false, message: "User not found" });
  }

  user.isActive = req.body.isActive;
  await user.save();
  user.password = undefined;

  res.status(200).json({
    status: true,
    message: `User account has been ${
      user.isActive ? "activated" : "disabled"
    }`,
  });
});

// ===========================
// PUT - Change Password
// ===========================
const changeUserPassword = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  if (userId === "65ff94c7bb2de638d0c73f63") {
    return res.status(403).json({
      status: false,
      message: "This is a test user. You cannot change the password.",
    });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ status: false, message: "User not found" });
  }

  user.password = req.body.password;
  await user.save();
  user.password = undefined;

  res.status(200).json({
    status: true,
    message: "Password changed successfully.",
  });
});

// ===========================
// DELETE - Delete User
// ===========================
const deleteUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  res.status(200).json({ status: true, message: "User deleted successfully" });
});

// ===========================
// Export Controllers
// ===========================
export {
  loginUser,
  registerUser,
  logoutUser,
  getTeamList,
  getNotificationsList,
  markNotificationRead,
  getUserTaskStatus,
  updateUserProfile,
  activateUserProfile,
  changeUserPassword,
  deleteUserProfile,
};
