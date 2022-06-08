// import models
const { category } = require("../../models");

// import joi
const Joi = require("joi");

// add category
exports.addCategory = async (req, res) => {
  // data input
  const data = req.body;

  // joi validate input
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  const { error } = schema.validate(data);

  if (error) {
    return res.send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  try {
    // check category exist
    const categoryExist = await category.findOne({
      where: {
        name: data.name,
      },
    });

    if (categoryExist) {
      return res.send({
        status: "Failed",
        message: "Category already registered",
      });
    }

    // create category
    const newCategory = await category.create(data);

    res.status(200).send({
      status: "Success",
      message: "Category successfully registered",
      data: {
        category: {
          id: newCategory.id,
          name: newCategory.name,
        },
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "Server error",
    });
  }
};

// get all category
exports.getCategories = async (req, res) => {
  try {
    // find all category
    const categoryData = await category.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    // category not found
    if (categoryData === null) {
      return res.status(400).send({
        status: "Failed",
        message: "Category data not found",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Category data found",
      data: {
        category: categoryData,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "Server error",
    });
  }
};

// get category
exports.getCategory = async (req, res) => {
  const { id } = req.params;
  try {
    // find all category
    const categoryData = await category.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.status(200).send({
      status: "Success",
      message: "Category data found",
      data: {
        category: categoryData,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "Server error",
    });
  }
};

// update category
exports.updateCategory = async (req, res) => {
  // get id params
  const { id } = req.params;

  // data input
  const data = req.body;

  // joi validate input
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  const { error } = schema.validate(data);

  if (error) {
    return res.send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  try {
    // check category exist
    const categoryExist = await category.findOne({
      where: {
        name: data.name,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (categoryExist) {
      return res.send({
        status: "Failed",
        message: "Category has been registered",
      });
    }

    // update
    await category.update(data, {
      where: {
        id,
      },
    });

    // find all category
    const categoryData = await category.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.status(200).send({
      status: "Success",
      message: "Category data updated successfully",
      data: {
        category: categoryData,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "Server error",
    });
  }
};

// delete category
exports.deleteCategory = async (req, res) => {
  // get id params
  const { id } = req.params;

  try {
    await category.destroy({
      where: {
        id,
      },
    });

    res.status(200).send({
      status: "Success",
      message: "Category successfully deleted",
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "Server error",
    });
  }
};
