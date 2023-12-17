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
exports.reportListing = (reporter, reportedPost, reportReason) => {
  exports.sendMail(bilmartMail,
    "Reported Post",
    `<h1>BilMart</h1><h2>The user "${reporter.username}" has reported the post <a href="http://localhost:3000/item/${reportedPost._id}">${reportedPost.title}</a> for the following reason:</h2><h3>"${reportReason}"</h3>`)

}
exports.wishlistNotificationToViewer = (user, post) => {
  const email = user.email;
  console.log(email)
  exports.sendMail(email,
      "Update to a wish-listed item",
          `<h1>BilMart</h1><h2>"${post.title}" has been recieved an update.</h2><h2></h2>`)
}
exports.forgotPasswordNotification = (user, token) => {
  const email = user.email;
  const username = user.username;
  exports.sendMail(email,
    "Forgot Password",
    `<h1>BilMart</h1><h2>Dear ${username},</h2><h2><a className="btn btn-dark" href="http://localhost:3000/changePassword/${token}">Click here to change your password</a></h2>`)
}
exports.ratingNotification = (posterMail, newRating) =>{
  sendMail(posterMail,
    "Your User Rating",    
    "<h1>BilMart</h1><h2>Your account has been rated. Your new rating is: " + newRating + ".</h2>")
}
exports.requestForContactInfoNotification = (posterMail, requestUserName, requestingMail, requestUserURL, itemName, postURL, phoneNumber, contactInfoPublic) =>{

  const message = `<h1>BilMart</h1>
              <h2>The user ${requestUserName} is interested in your item: <a href=${postURL}>${itemName}</a>. 
              Reach out to them:
              <ul>
                <li>${requestingMail}</li>
                ${contactInfoPublic ? `<li>${phoneNumber}</li>` : ''}
              </ul>
              </h2>
              <button>Accept Request</button>`

  exports.sendMail(posterMail, "Contact Request", message);
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