import User from "../models/User.js";
import Order from "../models/Order.js";
import Cake from "../models/Cake.js";

// ADMIN DASHBOARD STATS

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCakes = await Cake.countDocuments();

    const revenueAgg = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalCakes,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard stats",
    });
  }
};

// GET ALL USERS (ADMIN)

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};


// BLOCK / UNBLOCK USER (ADMIN)

export const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.role === "ADMIN") {
      return res.status(400).json({
        success: false,
        message: "Admin user cannot be blocked",
      });
    }

    user.blocked = !user.blocked;
    await user.save();

    res.json({
      success: true,
      message: user.blocked ? "User blocked" : "User unblocked",
      user,
    });
  } catch (error) {
    console.error("Block User Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
    });
  }
};


// GET ALL ORDERS (ADMIN)

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.cake", "name price image")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};


// UPDATE ORDER STATUS (ADMIN)

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: false }
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

// TOP SELLING CAKES (ADMIN)

export const getTopCakes = async (req, res) => {
  try {
    const topCakes = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.cake",
          sold: { $sum: "$items.quantity" },
        },
      },
      {
        $lookup: {
          from: "cakes",
          localField: "_id",
          foreignField: "_id",
          as: "cake",
        },
      },
      { $unwind: "$cake" },
      {
        $project: {
          _id: 0,
          name: "$cake.name",
          sold: 1,
        },
      },
      { $sort: { sold: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      success: true,
      topCakes,
    });
  } catch (error) {
    console.error("Get Top Cakes Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch top-selling cakes",
    });
  }
};
