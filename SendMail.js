const { MAILJET_PUBLIC_KEY, MAILJET_PRIVATE_KEY } = process.env

const mailjet = require('node-mailjet').apiConnect(
    MAILJET_PUBLIC_KEY,
    MAILJET_PRIVATE_KEY
)


const sendMail = async ({recipient, subject, content}) => {
    console.log({recipient, subject, content})
    await mailjet
    .post("send", { version:"v3.1"})
    .request({
      Messages:[
        {
          From: {
            Email: "janeiro.bruno23@gmail.com",
            Name: "Bruno Janeiro"
          },
          To: [
            {
              Email: recipient,
            }
          ],
          Subject: subject,
          HTMLPart: content,
          
        }
      ]
    })

}

module.exports = {sendMail};