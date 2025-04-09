const nodemailer = require('nodemailer');

// Configuración del transporter usando Gmail y credenciales desde .env
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

// Función para enviar correo de recuperación con link personalizado
async function sendResetEmail(email, token) {
  const resetLink = `http://localhost:8100/reset-pass?token=${token}`; // Enlace de recuperación

  const mailOptions = {
    from: `"Soporte" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Recuperación de Contraseña",
    html: `
      <h3>Solicitud de Recuperación de Contraseña</h3>
      <p>Haz clic en el enlace de abajo para restablecer tu contraseña:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Si no solicitaste esto, ignora este mensaje.</p>
    `,
  };

  // Propiedad de Jesús Emmanuel Morales Ruvalcaba 
  try {
    await transporter.sendMail(mailOptions); 
    console.log("Correo de recuperación enviado");
    return true;
  } catch (error) {
    console.error("Error enviando correo:", error);
    return false;
  }
}

module.exports = { sendResetEmail }; // Exportamos la función
