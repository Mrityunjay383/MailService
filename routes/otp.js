const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');


const User = require("../models/user");


router.get("/:apiKey/:reciverMail", (req, res) => {
  const apiKey = req.params.apiKey;
  const reciverMail = req.params.reciverMail;

 User.findOne({apiKey}, async (err, foundUser) => {
    if(foundUser){//checking if the API KEy is Valid

      if(foundUser.noOfCalls > 0){//Checking if your have api calls left

        let otp = Math.floor(Math.random() * 100000);

        const output = `
          <div style="text-align: center">
            <h3>OTP: ${otp}</h3>
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
          from: `${foundUser.name.split(" ")[0]}<${process.env.AUTHER_GMAILID}>`,
          to: reciverMail, //Change reciving email here
          subject: `OTP for Registration`,
          text: '',
          html: output
        };

        await transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error);
            return error;
          } else {
            console.log('Email sent: ' + info.response);

            foundUser.noOfCalls--;
            foundUser.save();
            res.json({otp});
          }
        });

      }else{
        res.send("You have exhausted api calls credit, please buy some more!!!");
      }

    }else{
      res.status(400).send("Invalid API Key");
    }
  });
});

module.exports = router;
