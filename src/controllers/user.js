// import model
const { user, profile } = require("../../models");

// cloudinary
const cloudinary = require("../utils/Cloudinary");

// get all user
exports.getUsers = async (req, res) => {
  try {
    // find all
    const userData = await user.findAll({
      include: {
        model: profile,
        as: "profile",
        attributes: {
          exclude: ["createdAt", "updatedAt", "id", "idUser"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    // response
    res.status(200).send({
      status: "Success",
      message: "User data found",
      data: {
        user: userData,
      },
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
    const dataUser = await user.findOne({
      where: {
        id,
      },
      include: {
        model: profile,
        as: "profile",
        attributes: {
          exclude: ["createdAt", "updatedAt", "id", "idUser"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    // if not found data
    if (dataUser == null) {
      return res.send({
        status: "Success",
        message: "User data not found",
      });
    }

    const data = {
      image: process.env.PATH_FILE_PROFILE + dataUser.profile.image,
      name: dataUser.name,
      email: dataUser.email,
      phone: dataUser.profile.phone,
      gender: dataUser.profile.gender,
      address: dataUser.profile.address,
    };

    // response
    res.status(200).send({
      status: "Success",
      message: "User data found",
      data: {
        user: data,
      },
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

  // cloudinary
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "DumbMerch/Profile",
    use_filename: true,
    unique_filename: false,
  });

  const data2 = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    gender: req.body.gender,
    address: req.body.address,
  };

  // core
  try {
    // user update
    await user.update(data2, {
      where: {
        id,
      },
    });

    if (req.file) {
      await profile.update(
        { ...data1, image: result.public_id },
        {
          where: {
            idUser: id,
          },
        }
      );
    }

    await profile.update(data2, {
      where: {
        idUser: id,
      },
    });

    // find one
    const dataUser = await user.findOne({
      where: {
        id: id,
      },
      include: {
        model: profile,
        as: "profile",
        attributes: {
          exclude: ["createdAt", "updatedAt", "idUser", "id"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    // response
    res.status(200).send({
      status: "Success",
      message: "User data updated successfully",
      data: {
        user: dataUser,
      },
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
