const sgMail   = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeMail = ({email,username})=>{
  sgMail.send({
    to      :  email,
    from    : 'codewithstatus200@gmail.com',
    subject : 'Welcome Mail',
    text    : `Welcome,${username} to our Pawsome Family. We are happy to have you.Jump right up to the website to see what's happening.`
  }).then(()=>{
    console.log("Email sent");
  }).catch((e)=>{console.log(e.response.body)})
}

const sendCancellationMail = ({email,username})=>{
  sgMail.send({
    to      : email,
    from    : 'codewithstatus200@gmail.com',
    subject : 'Goodbye Mail',
    text    : `We are sorry to see you go,${username}`
  }).then((res)=>{
    console.log(res);
  }).catch((e)=>{console.log(e.response.body)})
}

const sendOrderMail = (email,text) => {
  sgMail.send({
    to      :  email,
    from    : 'codewithstatus200@gmail.com',
    subject : 'Order Confirmation Mail',
    text
  }).then((res)=>{
    console.log(res);
  }).catch((e)=>{console.log(e.response.body)})
}

module.exports = {
  sendWelcomeMail,
  sendCancellationMail,
  sendOrderMail
}
