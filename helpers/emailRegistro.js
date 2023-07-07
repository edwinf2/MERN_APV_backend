import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {

  // var transport = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT,
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASS
  //   }
  // });

  const { email, nombre, token } = datos;

  //Enviando el email
  // const info = await transport.sendMail({
  //   from: 'APV - Administrador de Pacientes de Veterinaria',
  //   to: email,
  //   subject: 'Comprueba tu cuenta en APV',
  //   text: 'Comprueba tu cuenta en APV',
  //   html:
  //     `<h1>Bienvenido a APV - Administrador de Pacientes de Veterinaria</h1>
  //       <h2>Nombre: ${nombre}</h2>
  //       <p>Tu cuenta ya está lista. Por favor, comprobarla en el siguiente enlace:</p>
  //       <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>

  //       <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
  //       `
  // });

  // using Twilio SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs
  javascript
  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: email, // Change to your recipient
    from: 'APV - Administrador de Pacientes de Veterinaria', // Change to your verified sender
    subject: 'Comprueba tu cuenta en APV',
    text: 'Comprueba tu cuenta en APV',
    html: `<h1>Bienvenido a APV - Administrador de Pacientes de Veterinaria</h1>
    <h2>Nombre: ${nombre}</h2>
    <p>Tu cuenta ya está lista. Por favor, comprobarla en el siguiente enlace:</p>
    <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>

    <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
    `
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })

  console.log("Mensaje enviado: %s", info.messageId);

};

export default emailRegistro;