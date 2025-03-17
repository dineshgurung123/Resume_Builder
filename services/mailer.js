const nodemailer = require ('nodemailer')


const transporter = nodemailer.createTransport({

    service : process.env.SMPT_SERVICE,
    auth : 
    {
     user : process.env.SMPT_EMAIL,
     pass : process.env.SMPT_PASS

    }
})

transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email Server is ready to take our messages");
    }
  });


const sendEmail = async({to, subject, message}) => {

  return await transporter.sendMail({
        from: '"ProResumeAi" <no-reply@proresune.ai>', // sender address
        to, // list of receivers
        subject, // Subject line
        html: message, // html body
      });

}

module.exports = {sendEmail}