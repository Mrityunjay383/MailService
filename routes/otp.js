const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');

const User = require("../models/user");


// Sending OTP route
router.get("/:apiKey/:reciverMail", (req, res) => {
  const apiKey = req.params.apiKey;//API Key Provided by caller
  const reciverMail = req.params.reciverMail;//reciver mailId provided by caller

 User.findOne({apiKey}, async (err, foundUser) => {
    if(foundUser){//checking if the API KEy is Valid

      if(foundUser.noOfCalls > 0){//Checking if your have api calls left

        let otp = Math.floor(Math.random() * 100000);//Generating a randon number

        //html mail template
        const output = `
          <div style="text-align: center">
            <h3>OTP: ${otp}</h3>
            <p>${foundUser.mailDetails.message}</p>
            <p><b>Thank you.</b></p>
          </div>
        `;

        const transporter = await nodemailer.createTransport({

          service: 'gmail',
          secureConnection: true,
          auth: {
            user: process.env.AUTHER_GMAILID,
            pass: process.env.AUTHER_PASSWORD
          },
          tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
            secureProtocol: "TLSv1_method"
          }
        });

        var mailOptions = {
          from: `${foundUser.mailDetails.senderName}<${process.env.AUTHER_GMAILID}>`,
          to: reciverMail, //Change reciving email here
          subject: `${foundUser.mailDetails.mailSubject}`,
          text: '',
          html: output
        };

        await transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error);
            res.send(error);
          } else {
            console.log('Email sent: ' + info.response);

            //if the call is Successful, decrementing the number of calls left with user
            foundUser.noOfCalls--;
            foundUser.save();

            //returning the otp as json object
            res.json({otp});
          }
        });

      }else{
        //If user didnt have credits left
        res.send("You have exhausted api calls credit, please buy some more!!!");
      }

    }else{
      //API Key is not valid condition
      res.status(400).send("Invalid API Key");
    }
  });
});

module.exports = router;
