import { celebrate, Joi, Segments } from "celebrate";

const signupCelebrate = celebrate({
    [Segments.BODY]: Joi.object().keys({
        nome: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        senha: Joi.string().min(6).required()
    })
});

export {signupCelebrate}