import nodeMailer from 'nodemailer'

const bilmartMail = 'bilmart12@hotmail.com'
const transporter = nodeMailer.createTransport({
  service: 'hotmail',
  auth: {
    user: bilmartMail,
    pass: 'sudCo6-kaqxez-gowkan'
  }
})
let exports = {}

exports.sendMail = (reciever, subject, html) => {
  let options = {
    from: bilmartMail,
    to: reciever,
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
exports.wishlistNotification = (posterMail, itemName, postURL, wishlistCount) => {
  sendMail(posterMail,
    "Wishlisting",    
    "<h1>BilMart</h1><h2>Your item <a href=" + postURL +">" + itemName + "</a> has been wishlisted " + wishlistCount + " times.</h2>")
}
exports.ratingNotification = (posterMail, newRating) =>{
  sendMail(posterMail,
    "Your User Rating",    
    "<h1>BilMart</h1><h2>Your account has been rated. Your new rating is: " + newRating + ".</h2>")
}
exports.requestForContactInfoNotification = (posterMail, requestUserName, requestUserURL, itemName, postURL, ) =>{
  sendMail(posterMail,
    "Contact Request",    
    "<h1>BilMart</h1><h2> The user <a href=" + requestUserURL +">" + requestUserName + "</a> is interested in your item: <a href=" + postURL +">"  + itemName + "</a>."
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