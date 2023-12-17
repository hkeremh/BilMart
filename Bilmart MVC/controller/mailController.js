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

/**
 * Sends an email using the configured transporter.
 *
 * @param {string} receiver - The email address of the recipient.
 * @param {string} subject - The subject of the email.
 * @param {string} html - The HTML content of the email.
 * @returns {void} - No return value.
 */
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

/**
 * Sends a wishlist notification email to the item poster.
 *
 * @param {string} posterMail - The email address of the item poster.
 * @param {string} itemName - The name of the wishlisted item.
 * @param {string} wishlister - The name of the wishlister.
 * @param {number} wishlistCount - The current count of wishlists for the item.
 * @returns {void} - No return value.
 */
exports.wishlistNotification = (posterMail, itemName, wishlister, wishlistCount) => {
  exports.sendMail(posterMail,
    "Wish-listing",
    `<h1>BilMart</h1><h2>Your item "${itemName}" has been wishlisted by ${wishlister}.</h2><h2>It has been wishlisted ${wishlistCount} times.</h2>`)
}

/**
 * Sends a report notification email to the BilMart team.
 *
 * @param {object} reporter - The user who reported the post.
 * @param {object} reportedPost - The reported post object.
 * @param {string} reportReason - The reason for reporting the post.
 * @returns {void} - No return value.
 */
exports.reportListing = (reporter, reportedPost, reportReason) => {
  exports.sendMail(bilmartMail,
    "Reported Post",
    `<h1>BilMart</h1><h2>The user "${reporter.username}" has reported the post <a href="http://localhost:3000/item/${reportedPost._id}">${reportedPost.title}</a> for the following reason:</h2><h3>"${reportReason}"</h3>`)

}


/**
 * Sends a wishlist update notification email to a user who wishlisted an item.
 *
 * @param {object} user - The user who wishlisted the item.
 * @param {object} post - The updated post object.
 * @returns {void} - No return value.
 */
exports.wishlistNotificationToViewer = (user, post) => {
  const email = user.email;
  exports.sendMail(email,
      "Update to a wish-listed item",
          `<h1>BilMart</h1><h2>"${post.title}" has been recieved an update.</h2><h2></h2>`)
}

/**
 * Sends a forgot password notification email with a password reset link.
 *
 * @param {object} user - The user who forgot the password.
 * @param {string} token - The password reset token.
 * @returns {void} - No return value.
 */
exports.forgotPasswordNotification = (user, token) => {
  const email = user.email;
  const username = user.username;
  exports.sendMail(email,
    "Forgot Password",
    `<h1>BilMart</h1><h2>Dear ${username},</h2><h2><a className="btn btn-dark" href="http://localhost:3000/changePassword/${token}">Click here to change your password</a></h2>`)
}

/**
 * Sends a user rating notification email to the account poster.
 *
 * @param {string} posterMail - The email address of the account poster.
 * @param {number} newRating - The new rating assigned to the account.
 * @returns {void} - No return value.
 */
exports.ratingNotification = (posterMail, newRating) =>{
  sendMail(posterMail,
    "Your User Rating",    
    "<h1>BilMart</h1><h2>Your account has been rated. Your new rating is: " + newRating + ".</h2>")
}

/**
 * Sends a notification email to the item poster about a contact info request.
 *
 * @param {string} posterMail - The email address of the item poster.
 * @param {string} requestUserName - The username of the user making the request.
 * @param {string} requestingMail - The email address of the user making the request.
 * @param {string} requestUserURL - The URL of the user's profile.
 * @param {string} itemName - The name of the item the user is interested in.
 * @param {string} postURL - The URL of the post related to the item.
 * @param {string} phoneNumber - The phone number of the user making the request.
 * @param {boolean} contactInfoPublic - Indicates whether the user's contact info is public.
 * @returns {void} - No return value.
 */
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

/**
 * Sends a notification email to the user about the accepted contact info request.
 *
 * @param {string} userMail - The email address of the user making the contact info request.
 * @param {string} posterUserName - The username of the item poster.
 * @param {string} posterURL - The URL of the item poster's profile.
 * @param {string} itemName - The name of the item related to the contact info request.
 * @param {string} postURL - The URL of the post related to the item.
 * @param {string} posterContact - The phone number of the item poster.
 * @returns {void} - No return value.
 */
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