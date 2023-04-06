const Notification = require('../model/notification.model')

class NotificationService  {
  async createNotifications (data) {
    const notifications = await Notification.insertMany(data)
    return notifications
  }

}

module.exports = new NotificationService()