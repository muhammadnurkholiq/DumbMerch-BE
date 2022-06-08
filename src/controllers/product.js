// import models
const { product, user, category, categoryproduct } = require("../../models");

// import joi
const Joi = require("joi");

// cloudinary
const cloudinary = require("../utils/Cloudinary");

// add product
exports.addProduct = async (req, res) => {
  // data input
  const data = req.body;

  // cloudinary
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "DumbMerch/Product",
    use_filename: true,
    unique_filename: false,
  });

  // id from user
  const { id } = req.user;

  // joi validate input
  const schema = Joi.object({
    name: Joi.string().required(),
    desc: Joi.string().required(),
    price: Joi.number().required(),
    qty: Joi.number().required(),
    category: Joi.string().required(),
  });

  const { error } = schema.validate(data);

  if (error) {
    return res.send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  try {
    // find category
    const categoryData = await category.findOne({
      where: {
        name: data.category,
      },
    });

    // category not found
    if (categoryData == null) {
      return res.send({
        status: "Failed",
        message: "Category not found",
      });
    }

    // create product
    const newProduct = await product.create({
      ...data,
      image: result.public_id,
      idUser: id,
    });

    // create categoryproduct
    await categoryproduct.create({
      idProduct: newProduct.id,
      idCategory: categoryData.id,
    });

    let productData = await product.findOne({
      where: {
        id: newProduct.id,
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: category,
          as: "categories",
          through: {
            model: categoryproduct,
            as: "bridge",
            attributes: [],
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    productData = JSON.parse(JSON.stringify(productData));
    res.status(200).send({
      status: "Success",
      message: "Product created successfully",
      data: {
        ...productData,
        image: process.env.PATH_FILE_PRODUCT + productData.image,
      },
    });
  } catch (error) {
    res.status(400).send({
      status: "Error",
      message: "Server error",
    });
  }
};

// get all product
exports.getProducts = async (req, res) => {
  try {
    let productData = await product.findAll({
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: category,
          as: "categories",
          through: {
            model: categoryproduct,
            as: "bridge",
            attributes: [],
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    productData = JSON.parse(JSON.stringify(productData));

    productData = productData.map((item) => {
      return {
        ...item,
        image: process.env.PATH_FILE_PRODUCT + item.image,
      };
    });

    res.send({
      status: "success...",
      message: "Product data found",
      data: {
        product: productData,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "Server error",
    });
  }
};

// get product
exports.getProduct = async (req, res) => {
  // get id params
  const { id } = req.params;

  try {
    // find product
    let productData = await product.findOne({
      where: { id },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: category,
          as: "categories",
          through: {
            model: categoryproduct,
            as: "bridge",
            attributes: [],
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    // product not found
    if (productData === null) {
      return res.send({
        status: "Success",
        message: "Product data not found",
      });
    }

    productData = JSON.parse(JSON.stringify(productData));

    productData = {
      ...productData,
      image: process.env.PATH_FILE_PRODUCT + productData.image,
    };

    res.send({
      status: "success...",
      message: "Product data found",
      data: {
        product: productData,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "Server error",
    });
  }
};

// update product
exports.updateProduct = async (req, res) => {
  // get id params
  const { id } = req.params;

  // cloudinary
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "DumbMerch/Product",
    use_filename: true,
    unique_filename: false,
  });

  // data
  const data1 = req.body;

  const data2 = {
    name: req.body.name,
    desc: req.body.desc,
    price: req.body.price,
    qty: req.body.qty,
    category: req.body.category,
  };

  try {
    // find category
    const categoryData = await category.findOne({
      where: {
        name: data1.category,
      },
    });

    const categoryValue = {
      idProduct: id,
      idCategory: categoryData.id,
    };

    await categoryproduct.update(categoryValue, {
      where: {
        idProduct: id,
      },
    });

    // update product
    if (req.file) {
      await product.update(
        { ...data1, image: result.public_id },
        {
          where: {
            id,
          },
        }
      );
    }

    await product.update(data2, {
      where: {
        id,
      },
    });

    // find product
    let productData = await product.findOne({
      where: { id },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: category,
          as: "categories",
          through: {
            model: categoryproduct,
            as: "bridge",
            attributes: [],
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    productData = JSON.parse(JSON.stringify(productData));

    res.status(200).send({
      status: "Success",
      message: "Product data found",
      data: {
        ...productData,
        image: process.env.PATH_FILE_PRODUCT + productData.image,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "Server error",
    });
  }
};

// delete product
exports.deleteProduct = async (req, res) => {
  // get id params
  const { id } = req.params;
  try {
    const data = await product.findOne({
      where: {
        id,
      },
    });

    await product.destroy({
      where: {
        id,
      },
    });

    res.status(200).send({
      status: "Success",
      message: "Product data deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "Server error",
    });
  }
};
