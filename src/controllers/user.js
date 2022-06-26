// import model
const { user } = require("../../models");

// cloudinary
const cloudinary = require("../utils/Cloudinary");

// get all user
exports.getUsers = async (req, res) => {
  try {
    // find all
    let userData = await user.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    userData = JSON.parse(JSON.stringify(userData));

    userData = userData.map((item) => {
      return {
        ...item,
        image: process.env.PATH_FILE + item.image,
      };
    });
    // response
    res.status(200).send({
      status: "Success",
      message: "User data found",
      data: userData,
    });
  } catch (error) {
    res.status(500).send({
      status: "Failed",
      message: "Server error",
    });
  }
};

// get user
exports.getUser = async (req, res) => {
  // get id from user
  const { id } = req.user;
  try {
    // find one
    let userData = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    userData = JSON.parse(JSON.stringify(userData));

    userData = {
      ...userData,
      image: process.env.PATH_FILE + userData.image,
    };

    // response
    res.status(200).send({
      status: "Success",
      message: "User data found",
      data: userData,
    });
  } catch (error) {
    res.status(500).send({
      status: "Failed",
      message: "Server error",
    });
  }
};

// update user
exports.updateUser = async (req, res) => {
  // get id from user
  const { id } = req.user;
  // data input
  const data1 = req.body;

  const data2 = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    gender: req.body.gender,
    address: req.body.address,
  };

  // core
  try {
    if (req.file) {
      // get data before update
      const beforeUpdate = await user.findOne({
        where: {
          id,
        },
      });

      // delete file to cloudinary
      cloudinary.uploader.destroy(beforeUpdate.image);

      // cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "DumbMerch/Profile",
        use_filename: true,
        unique_filename: false,
      });

      // update profile
      await user.update(
        { ...data1, image: result.public_id },
        {
          where: {
            id,
          },
        }
      );
    } else {
      await user.update(data2, {
        where: {
          id,
        },
      });
    }

    // find one
    const dataUser = await user.findOne({
      where: {
        id: id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    const data = {
      name: dataUser.name,
      email: dataUser.email,
      image: process.env.PATH_FILE + dataUser.image,
      phone: dataUser.phone,
      gender: dataUser.gender,
      address: dataUser.address,
    };

    // response
    res.status(200).send({
      status: "Success",
      message: "User data updated successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      status: "Failed",
      message: "Server error",
    });
  }
};

// delete user
exports.deleteUser = async (req, res) => {
  // get id from user
  const { id } = req.user;

  try {
    // get data before update
    const beforeUpdate = await user.findOne({
      where: {
        id,
      },
    });

    // delete file to cloudinary
    cloudinary.uploader.destroy(beforeUpdate.image);

    await user.destroy({
      where: {
        id,
      },
    });

    // response
    res.status(200).send({
      status: "Success",
      message: "User data deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      status: "Failed",
      message: "Server error",
    });
  }
};
