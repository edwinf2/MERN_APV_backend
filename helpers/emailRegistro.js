import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {

    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    
    const {email, nombre, token} = datos;

    //Enviando el email
    const info = await transport.sendMail({
        from: '"APV - Administrador Pacientes Veterinaria" <apv@correo.com>',
        to: email,
        subject: 'Comprueba tu cuenta en APV',
        text: 'Comprueba tu cuenta en APV',
        html: 
        `<h1>Bienvenido a APV - Administrador de Pacientes de Veterinaria</h1>
        <h2>Nombre: ${nombre}</h2>
        <p>Tu cuenta ya está lista. Por favor, comprobarla en el siguiente enlace:</p>
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>

        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    });

    console.log("Mensaje enviado: %s", info.messageId);

};

export default emailRegistro;