import axios from 'axios';
import XLData from '../models/sub_excel.js'; // Ensure this is the correct path to your model

export const sesNotification = async (req, res) => {
  try {

    if (req.body.Type === 'SubscriptionConfirmation') {
      // Confirm the subscription by calling the SubscribeURL
      const confirmationResponse = await axios.get(req.body.SubscribeURL);
      console.log('Subscription confirmed:', confirmationResponse.data);
      res.status(200).send('OK');
      return;
    }

    const { messageId } = req.body.mail;
    const { notificationType } = req.body;

    // Update the corresponding XLData document
    await XLData.findOneAndUpdate(
      { MessageId: messageId }, // Find by MessageId
      { notificationType: notificationType }, // Set the notificationType
      { new: true } // Return the updated document
    );
    console.log(`Updated XLData for MessageId: ${messageId} with NotificationType: ${notificationType}`);

    // Send a response to acknowledge receipt of the notification
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing SNS notification:', error);
    res.status(500).send('Error processing message');
  }
};
