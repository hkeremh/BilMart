import nodeMailer from 'nodemailer'
import userModel from "../model/userModel.js";

const bilmartMail = 'bilmart12@hotmail.com'
const transporter = nodeMailer.createTransport({
  service: 'hotmail',
  auth: {
    user: bilmartMail,
    pass: 'sudCo6-kaqxez-gowkan'
  }
})
let exports = {}

exports.sendMail = (receiver, subject, html) => {
  let options = {
    from: bilmartMail,
    to: receiver,
    subject: subject,
    html: html
  }
  transporter.sendMail(options, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  })
}
exports.wishlistNotification = (posterMail, itemName, wishlister, wishlistCount) => {
  exports.sendMail(posterMail,
    "Wish-listing",
    `<h1>BilMart</h1><h2>Your item "${itemName}" has been wishlisted by ${wishlister}.</h2><h2>It has been wishlisted ${wishlistCount} times.</h2>`)
}
exports.wishlistNotificationToViewer = (user, post) => {
  const email = user.email

  exports.sendMail(email,
      "Update to a wish-listed item",
          `<h1>BilMart</h1><h2>"${post.title}" has been recieved an update.</h2><h2></h2>`)
}

exports.forgotPasswordNotification = (user) => {
  const email = user.email;
  const username = user.username;
  const id = user._id;
  exports.sendMail(email,
    "Forgot Password",
    `<h1>BilMart</h1><h2>Dear ${username},</h2><h2><a className="btn btn-dark" href="http://localhost:3000/changePassword/${id}">Click here to change your password</a></h2>`)
}
exports.ratingNotification = (posterMail, newRating) =>{
  sendMail(posterMail,
    "Your User Rating",    
    "<h1>BilMart</h1><h2>Your account has been rated. Your new rating is: " + newRating + ".</h2>")
}
exports.requestForContactInfoNotification = (posterMail, requestUserName, requestingMail, requestUserURL, itemName, postURL) =>{
  exports.sendMail(posterMail,
    "Contact Request",    
    "<h1>BilMart</h1><h2> The user <a href=" + requestUserURL +">" + requestUserName + "</a> is interested in your item: <a href=" + postURL +">"  + itemName + "</a>."
      + `<h1>Their mail: ${requestingMail}</h1>`
    + "</h2>"
    + "<button> Accept request</button>"
    )
}
exports.contactInfoRecievedNotification = (userMail, posterUserName, posterURL, itemName, postURL, posterContact) => {
  sendMail(userMail,
    "Contact Request Accepted",    
    "<h1>BilMart</h1><h2> The user <a href=" + posterURL +">" + posterUserName + "</a> has accepted your contact information request for item: <a href=" + postURL +">"  + itemName + "</a>."
    + "</h2>"
    + "<h2>Phone number: " + posterContact + "</h2>"
    )
}
exports.postChangeNotification = (userMail, postName, postURL) => {}

export default exports;