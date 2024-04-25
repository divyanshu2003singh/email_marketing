import Excel from '../models/excel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateShortLink } from './urlController.js';
import { SMTPServer } from 'smtp-server';
import XLData from '../models/sub_excel.js';
import AWS from 'aws-sdk';
import { config } from "dotenv";



config({
  path: "./config/config.env"
})

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// this controller for sanding mails 
// Configure AWS SDK with your AWS credentials and region
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.AWS_REASION
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

// Send email function
export const sendEmail = async (req, res) => {
  try {
    const id = req.params.id;
    const {emailformail, username, noticeType } = req.body;
    console.log(req.body)
    // const emailformail = "pradeep@recqarz.com"


    // Update data in Excel document based on the provided ID
    await Excel.findByIdAndUpdate(id, req.body, {
      new: true // Returns the updated document
    });

    // Find associated XLData documents with a matching excelId
    const xlDataEntries = await XLData.find({ excelId: id });

    // Generate and send emails for each data entry found
    const mailPromises = xlDataEntries.map(async (data) => {

      // Generate the PDF URL
      const pdfUrl = `https://f8a0-180-151-26-74.ngrok-free.app/excel/pdf/${id}/${data._id}`;

      // Generate a short link for the PDF URL
      const shortLink = await generateShortLink(pdfUrl);
      const ShortUrl = `https://f8a0-180-151-26-74.ngrok-free.app/url/${shortLink}`

      // Generate HTML content for the email body
      const html = generateEmailHtml(username, noticeType, ShortUrl, data);

      const emailParams = {
        Destination: {
          ToAddresses: [data["E-mail"]], // Recipient's email // Up to 50 recipients per batch
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: html, // HTML content for the email body
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: 'Friendly Reminder: Outstanding Payment Due',
          },
        },
        Source: emailformail, // Verified sender email address
      };

      const sentEmailData = await ses.sendEmail(emailParams).promise();
      console.log('Email sent:', sentEmailData.MessageId);


      // Update the XLData document with the ShortUrl and MessageId
      await XLData.findByIdAndUpdate(data._id, {
        ShortUrl: ShortUrl,
        MessageId: sentEmailData.MessageId
      }, { new: true }); // This will update the document with the new values

    });

    // Wait for all emails to be sent before responding
    await Promise.all(mailPromises);

    // Send success response to the client
    return res.status(200).json({ message: "Saved" });
  } catch (error) {
    console.error('Error in sendEmails:', error);
    res.status(500).json({ message: 'An error occurred on the server side' });
  }
};

// Function to generate HTML content for the email body
const generateEmailHtml = (username, noticeType, ShortUrl, data) => {
  const templateFilePath = path.join(__dirname, '..', 'htmlscript', `${username + "_" + noticeType}.html`);
  const htmlTemplate = fs.readFileSync(templateFilePath, 'utf8');

  let html = htmlTemplate.replace('{{shortLink}}', `<a href="${ShortUrl}">${ShortUrl}</a>`);

  // Define the keys you want to replace in the template
  const keysToReplace = [
    'Notice ID', 'DATE', 'ACCOUNT', 'CARDNO', 'FPR_NAME', 'FPR_LD_LIN', 'FPR_MOB',
    'EMBONAME', 'ADDRESS1', 'ADDRESS2', 'CITY', 'STATE', 'PINCODE', 'NEWRISKREGION',
    'NEW_CURR BAL', 'RISKCLASS', 'BLOCK1', 'BLOCK2', 'ZONE', 'SENDER', 'BKT',
    'MOBILEPHONE_HOME', 'TRIGGER', 'ACTIVITY', 'STAGE', 'DPI_Amount', 'Cur Bal',
    'Notice Amount(Cur bal+DPI)', 'E-mail', 'CASE No', 'REF_NO', 'NAME_OF_ARBITRATOR',
    'ADDRESS_OF_ARBITRATOR1', 'ADDRESS_OF_ARBITRATOR2', 'CITY', 'PINCODE_ARB',
    'DATE_ARB', 'TIME_ARB', 'MEETING_LINK', 'MEETING_PASSWORD', 'MEETING_ID',
    'NOTICE_DATE', 'NAME_OF_CONCILIATOR', 'DATE_OF_CONCILIATION', 'TIMING_OF_CONCILIATION'
  ];

  // Replace each placeholder in the HTML template with corresponding values from the data object
  keysToReplace.forEach((key) => {
    const regex = new RegExp(`\\[${key}\\]`, 'gi');
    html = html.replace(regex, data[key] || ''); // Replace placeholders with data values
  });

  return html;  // Return the updated HTML content
};



// this controller for receiving emails  
export const createSmptServers = async (req, res) => {
  try {
    // Define SMTP server configuration
    const smtpServer = new SMTPServer({
      // Allow incoming connections on port 25 (you can use a different port if needed)
      port: 25,

      // Disable authentication for simplicity (you can add authentication logic)
      // Comment out this block if authentication is not required
      onAuth(auth, session, callback) {
        callback(null, { user: 'anonymous' });
      },

      // Handle incoming messages
      onData(stream, session, callback) {
        let data = '';
        stream.on('data', (chunk) => {
          data += chunk;
        });

        stream.on('end', () => {
          // Here you can handle the incoming email data
          console.log('Received message:', data);
          // Process the email data as needed
          // For example, you can save the email to a file or database
          // You can also implement logic to forward or process the email content
          callback();
        });
      },
    });

    // Start the SMTP server
    smtpServer.listen(25, 'localhost', () => {
      console.log('SMTP server is running on port 25');
    });

    // Respond with a success message
    res.status(200).json({ message: 'SMTP server created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



/// this is for sms sending
export const sendSMS = async (req, res) => {
  try {

    // 
    const { username, password, type, dlr, destination, source, message } = req.query;

    // Send SMS request
    // Bulk Http Link : 
    // http://sms6.rmlconnect.net:8080/bulksms/bulksms?username=xxxxxxxx&password=xxxxxx&type=0&dlr=1&destination=xxxxxxxxxx&source=Demo&message=Demo%20Message
    // const response = await axios.get('http://sms6.rmlconnect.net:8080/bulksms/bulksms', {
    //   params: {
    //     username,
    //     password,
    //     type,
    //     dlr,
    //     destination,
    //     source,
    //     message,
    //   },
    // });
    // res.status(200).json({ success: true, message: 'SMS sent successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred while sending SMS' });
  }
}
