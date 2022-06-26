// import models
const { product, user } = require("../../models");

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
  });

  const { error } = schema.validate(data);

  if (error) {
    return res.send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  try {
    // create product
    const newProduct = await product.create({
      ...data,
      image: result.public_id,
      idUser: id,
    });

    let productData = await product.findOne({
      where: {
        id: newProduct.id,
      },
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    productData = JSON.parse(JSON.stringify(productData));

    productData = {
      ...productData,
      image: process.env.PATH_FILE_PRODUCT + productData.image,
    };
    res.status(200).send({
      status: "Success",
      message: "Product created successfully",
      data: productData,
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
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    productData = JSON.parse(JSON.stringify(productData));

    productData = productData.map((item) => {
      return {
        ...item,
        image: process.env.PATH_FILE + item.image,
      };
    });

    res.send({
      status: "Success",
      message: "Product data found",
      data: productData,
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
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      },
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
      image: process.env.PATH_FILE + productData.image,
    };

    res.send({
      status: "Success",
      message: "Product data found",
      data: productData,
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

  // data
  const data1 = req.body;

  const data2 = {
    name: req.body.name,
    desc: req.body.desc,
    price: req.body.price,
    qty: req.body.qty,
  };

  try {
    // update product
    if (req.file) {
      // get data before update
      const beforeUpdate = await product.findOne({
        where: {
          id,
        },
      });

      // delete file to cloudinary
      cloudinary.uploader.destroy(beforeUpdate.image);

      // upload file to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "DumbMerch/Product",
        use_filename: true,
        unique_filename: false,
      });

      // update product
      await product.update(
        { ...data1, image: result.public_id },
        {
          where: {
            id,
          },
        }
      );
    } else {
      await product.update(data2, {
        where: {
          id,
        },
      });
    }

    // find product
    let productData = await product.findOne({
      where: { id },
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    productData = JSON.parse(JSON.stringify(productData));

    productData = {
      ...productData,
      image: process.env.PATH_FILE + productData.image,
    };

    res.status(200).send({
      status: "Success",
      message: "Product data found",
      data: productData,
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "Server error",
    });
    console.log(error);
  }
};

// delete product
exports.deleteProduct = async (req, res) => {
  // get id params
  const { id } = req.params;

  try {
    // get data before update
    const beforeUpdate = await product.findOne({
      where: {
        id,
      },
    });

    // delete file to cloudinary
    cloudinary.uploader.destroy(beforeUpdate.image);

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
