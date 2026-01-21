//to send-recieve  notification function
const logger = require("./logger");
const NotificationModel = require("../models/notification");
const { successTemplate } = require("./template");

//send notification case
//request : fromUserName(senderId),status(read),eventName(connection-request),eventDesc(<senderId> has sent u a connection request)

// at receiver end we will just modify the existing doucment that belongs to the reciver

async function handleNotification(senderId, receiverId, eventName, eventDesc) {
  try {
    const sendNotification = await NotificationModel.create({
      senderId: senderId,
      receiverId: receiverId,
      status: "unread",
      eventName: eventName,
      eventDesc: eventDesc,
    });
    // console.log(sendNotification)

    // Log and send the success response
    logger.log({
      level: "info",
      message: await successTemplate(201, eventDesc),
      data: sendNotification,
    });
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error in handleNotification : ${error.message}`,
    });
    throw error;
  }
}

module.exports = handleNotification;
