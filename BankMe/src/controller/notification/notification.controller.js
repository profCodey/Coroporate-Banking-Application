const Notification = require("../../model/notification.model");
const { PER_PAGE } = require("../../utils/constants");
const mongoose = require("mongoose");

/**
 * Endpoints to get all user notifications
 *
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { perPage, page } = req.query;

    const options = {
      page: page || 1,
      limit: perPage || PER_PAGE,
      sort: { createdAt: -1 },
    };

    const notifications = await Notification.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
          pipeline : [
            { $project : { _id: 1, firstName: 1, lastName: 1 } }
          ],
        },
      },
      {
        $unwind: "$user",
      },
      {
        $unwind: "$transaction",
      },
      {
        $facet: {
          data: [
            {
              $sort: { ...options.sort },
            },
            {
              $skip: options.limit * (options.page - 1),
            },
            {
              $limit: options.limit * 1,
            },
          ],
          meta: [
            {
              $count: "total",
            },
            {
              $addFields: {
                page: options.page,
                perPage: options.limit,
              },
            },
          ],
        },
      },
    ]);

    return res.status(200).json({
      message: "Successfully fetched notifications",
      data: {
        notifications: notifications[0].data,
        meta: notifications[0].meta[0],
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Endpoints to get all notifications for a user
 *
 * @param {*} req
 * @param {*} res
 * @param {*} req.body.notifications - array of notification ids
 * @return {*}
 */

const deleteNotifications = async (req, res) => {
  const user = req.user._id;
  const notifications = req.body.notifications;

  try {
    await Notification.deleteMany({
      user: user,
      _id: { $in: notifications },
    });
    return res.status(200).json({
      message: "Successfully deleted notifications",
      status: "success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
      status: "failed",
    });
  }
};

/**
 * Endpoint to mar notifications as read
 *
 * @param {*} req
 * @param {*} res
 * @param {*} req.body.notifications - array of notification ids
 * @return {*} 
 */
const markNotificationsAsRead = async (req, res) => {
  const user = req.user._id;
  const notifications = req.body.notifications;

  try {
    await Notification.updateMany(
      {
        user: mongoose.Types.ObjectId(user),
        _id: { $in: notifications },
      },
      { read: true }
    );
    return res.status(200).json({
      message: "Successfully marked notifications as read",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: "failed",
    });
  }
}

module.exports = {
  getMyNotifications,
  deleteNotifications,
  markNotificationsAsRead,
};
