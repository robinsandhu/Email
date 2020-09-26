require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.get('/register', (req, res) => {
    res.render('login', {msg: ''});
});

app.post('/register', async (req, res) => {
    console.log(req.body);

    let message = `
    <h3>This is a response!</h3>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
        <li>Company: ${req.body.company}</li>
        <li>Phone: ${req.body.phone}</li>
        <li>Message: ${req.body.message}</li>
    </ul>
    `;

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL, // generated ethereal user
          pass: process.env.PASS, // generated ethereal password
        },
        
    });
    
    try{
        // send mail with defined transport object
        let info = await transporter.sendMail({
        from: `"Testify" <${process.env.SENDER_EMAIL}>`, // sender address
        to: `${process.env.RECEIVER_EMAIL}`, // list of receivers
        subject: "Form Update", // Subject line
        text: "Hello world?", // plain text body
        html: message, // html body
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        // after done
        res.render('login', {msg: 'Email has been sent!'});
    }catch(error){
        console.log(error);
    }
});

app.listen(process.env.PORT, () => {
    console.log('Server is listening!!!');
});