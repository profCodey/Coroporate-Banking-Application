const User = require("../../model/user.model");
const AdminRequest = require("../../model/adminRequest");

const getAllAdminRequests = async (req, res) => {
    try {
        const adminRequests = await AdminRequest.find();
        res.status(200).json({
        message: "Successfully fetched admin requests",
        data: { adminRequests },
        status: "success",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
        message: error.message,
        status: "failed",
        });
    }
    }

    const getMyRequests = async (req, res) => {
      try {
        const adminRequests = await AdminRequest.findById(req.user._id);
        res.status(200).json({
          message: "Successfully fetched your requests",
          data: { adminRequests },
          status: "success",
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          message: error.message,
          status: "failed",
        });
      }
    };

    const createAdminRequests = async (req, res) => {
      try {
          const adminRequests = await AdminRequest.create({
            sender: req.user._id,
            role: req.body.role,
            topic: req.body.topic,
            message: req.body.message,
          });

          await adminRequests.save();

        res.status(200).json({
          message: "Your request has been logged Successfully",
          status: "success",
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          message: error.message,
          status: "failed",
        });
      }
    };

      const superUserResponseById = async (req, res) => {
        try {
        let adminId = req.params._id
              const adminResponse = await AdminRequest.findById(id);
              adminRequest.response.push(req.body.response)
          await adminResponse.save();

          res.status(200).json({
            message: "Successfully responded to admin request",
            data: { adminResponse },
            status: "success",
          });
        } catch (error) {
          console.log(error);
          res.status(500).json({
            message: error.message,
            status: "failed",
          });
        }
      };

      module.exports = {
        getAllAdminRequests,
getMyRequests,
createAdminRequests,
superUserResponseById,
      }