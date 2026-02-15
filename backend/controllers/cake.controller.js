import Cake from "../models/Cake.js";
import fs from "fs";

// GET ALL CAKES (USER + ADMIN)

export const getCakes = async (req, res) => {
  try {
    const cakes = await Cake.find().sort({ createdAt: -1 });

    res.json(cakes);
  } catch (error) {
    console.error("Get Cakes Error:", error);
    res.status(500).json({
      message: "Failed to fetch cakes",
    });
  }
};

// ADD CAKE (ADMIN ONLY)

export const addCake = async (req, res) => {
  try {
    const {
      name,
      price,
      stock,
      category,
      egg,
      description,
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        message: "Name, price and category are required",
      });
    }

    const cake = await Cake.create({
      name,
      price: Number(price),
      stock: Number(stock || 0),
      category,
      egg: egg === "true" || egg === true,
      description,
      image: req.file ? req.file.path : null,
    });

    res.status(201).json(cake);
  } catch (error) {
    console.error("Add Cake Error:", error);
    res.status(500).json({
      message: "Failed to add cake",
    });
  }
};

// UPDATE CAKE (ADMIN ONLY)

export const updateCake = async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);

    if (!cake) {
      return res.status(404).json({ message: "Cake not found" });
    }

    const {
      name,
      price,
      stock,
      category,
      egg,
      description,
    } = req.body;

    cake.name = name || cake.name;
    cake.price = price ? Number(price) : cake.price;
    cake.stock = stock ? Number(stock) : cake.stock;
    cake.category = category || cake.category;
    cake.egg =
      egg !== undefined ? (egg === "true" || egg === true) : cake.egg;
    cake.description = description || cake.description;

    // If new image uploaded → delete old image
    if (req.file) {
      if (cake.image && fs.existsSync(cake.image)) {
        fs.unlinkSync(cake.image);
      }
      cake.image = req.file.path;
    }

    const updatedCake = await cake.save();

    res.json(updatedCake);
  } catch (error) {
    console.error("Update Cake Error:", error);
    res.status(500).json({
      message: "Failed to update cake",
    });
  }
};

// DELETE CAKE (ADMIN ONLY)

export const deleteCake = async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);

    if (!cake) {
      return res.status(404).json({ message: "Cake not found" });
    }

    if (cake.image && fs.existsSync(cake.image)) {
      fs.unlinkSync(cake.image);
    }

    await cake.deleteOne();

    res.json({ message: "Cake deleted successfully" });
  } catch (error) {
    console.error("Delete Cake Error:", error);
    res.status(500).json({
      message: "Failed to delete cake",
    });
  }
};
