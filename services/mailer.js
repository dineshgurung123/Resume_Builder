const nodemailer = require ('nodemailer')
const events = require ('events')

const mailEvents = new events.EventEmitter()

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
        from: '"ProResumeAi" <no-reply@proresume.ai>', // sender address
        to, // list of receivers
        subject, // Subject line
        html: message, // html body
      });

}

mailEvents.on("sendEmail",  async(to, subject, message)=>{
   
  await sendEmail({to, subject, message})

})

module.exports = {sendEmail, mailEvents}