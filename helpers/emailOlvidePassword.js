import nodemailer from 'nodemailer';

const emailOlvidePassword = async (datos) => {

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
        from: 'APV - Administrador de Pacientes de Veterinaria',
        to: email,
        subject: 'Restablece tu password',
        text: 'Restablece tu password',
        html: 
        `<h2>Nombre: ${nombre}</h2>
        <p>Has solicitado reestablecer tu password.</p>
        <p>Sigue el siente enlace para generar un nuevo password: </p>
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer Password</a>

        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    });

    console.log("Mensaje enviado: %s", info.messageId);

};

export default emailOlvidePassword;