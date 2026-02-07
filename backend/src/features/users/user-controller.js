import User from "../users/user.model.js";
import asyncHandler from "../../shared/utils/async-handler.js";

export const getUsers = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user._id;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const search = req.query.search;

  let query = {
    _id: { $ne: loggedInUserId },
  };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(query)
    .skip(skip)
    .limit(limit);

  const totalUsers = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    page,
    limit,
    totalUsers,
    totalPages: Math.ceil(totalUsers / limit),
    users,
  });
});
