import * as userService from "./user.service.js";

/**
 * Get users for sidebar (excluding current logged-in user)
 * @route GET /api/users
 */
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await userService.getUsersExceptCurrent(loggedInUserId);
    
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
