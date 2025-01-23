const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();
app.use(express.json());

app.get("/home", async (req, res) => {
  const allproduct = await prisma.product.findMany();
  res.json(allproduct);
});
app.get("/product/:id", async (req, res) => {
  let productId = Number(req.params.id);
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
  res.json(product);
});

app.post("/add", async (req, res) => {
  try {
    const { name, price, quantity } = req.body;
    if (!name || !price || !quantity) {
      return res.status(400).json({ message: "Invalid input data" });
    }
    const addProduct = await prisma.product.create({
      data: { name, price, quantity },
    });

    res.json({
      message: "Product added successfully",
      data: addProduct,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error adding product", error: error.message });
  }
});

app.put("/edit/:id", async (req, res) => {
  let updateId = Number(req.params.id);
  try {
    const { name, price, quantity } = req.body;
    if (!name || !price || !quantity) {
      return res.status(400).json({ message: "Invalid input data" });
    }
    const updateProduct = await prisma.product.update({
      where: { id: updateId },
      data: {
        name: name,
        price: price,
        quantity: quantity,
      },
    });
    res.json({
      message: "Product update successfully",
      data: updateProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "update error" });
  }
});

app.delete("/delete/:id", async (req, res) => {
  let deleteId = Number(req.params.id);
  try {
    const deleteProduct = await prisma.product.delete({
      where: { id: deleteId },
    });
    res.json({
      message: "Product delete successfully",
      data: deleteProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "delete error" });
  }
});

const port = 8000;
app.listen(port, (req, res) => {
  console.log("http sever run at " + port);
});
