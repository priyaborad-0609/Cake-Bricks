import Order from "../models/Order.js";

export const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const formattedItems = items.map((item) => ({
      cake: item._id,
      name: item.name,
      price: item.price,
      quantity: item.qty,
    }));

    const order = await Order.create({
      user: req.user._id,
      items: formattedItems,
      totalAmount,
      address,
    });

    res.status(201).json(order);

  } catch (error) {
    console.error("ORDER ERROR:", error);
    res.status(500).json({
      message: "Server Error while creating order",
    });
  }
};

export const myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.cake")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    console.error("FETCH ORDERS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};



// Cancel Order (User)
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Make sure user can cancel only their own order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Only allow cancel if not delivered
    if (order.status === "Delivered") {
      return res.status(400).json({ message: "Delivered order cannot be cancelled" });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });

  } catch (error) {
    console.error("CANCEL ORDER ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
