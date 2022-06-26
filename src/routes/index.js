const express = require("express");

const router = express.Router();

// middlewares
const { auth } = require("../middlewares/auth");
const { uploadProduct, uploadProfile } = require("../middlewares/uploadFile");

// controllers
// auth
const { register, login, checkAuth } = require("../controllers/auth");
// user
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");
// product
const {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");

// transaction
const {
  getTransactions,
  addTransaction,
} = require("../controllers/transaction");

// route
// auth - router
router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth);

// user - router
router.get("/users", getUsers);
router.get("/user", auth, getUser);
router.patch("/user", auth, uploadProfile("image"), updateUser);
router.delete("/user", auth, deleteUser);

// product - router
router.post("/products", auth, uploadProduct("image"), addProduct);
router.get("/products", auth, getProducts);
router.get("/products/:id", auth, getProduct);
router.patch("/products/:id", auth, uploadProduct("image"), updateProduct);
router.delete("/products/:id", auth, deleteProduct);

// Transaction - router
router.get("/transactions", auth, getTransactions);
router.post("/transaction", auth, addTransaction);

module.exports = router;
