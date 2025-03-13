const axios = require('axios'); 
require("dotenv").config(); 

const verifyRecaptcha = async (req, res, next) => {
    const { recaptchaToken } = req.body; 

    if(!recaptchaToken){
        return res.status(400).json({ error: "CAPTCHA requerido "}); 
    }

    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
        );

        if (!response.data.success) {
            return res.status(400).json({ error: "CAPTCHA no válido" });
        }

        next();
    } catch (error){
        res.status(500).json({ error: "Error validando CAPTCHA" });
    }
}

module.exports = { verifyRecaptcha }; 