const Yup = require('yup');

module.exports = async (req, res, next) => {

    try {
        const validationSchema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required(),
            confirmPassword: Yup.string()
            .required()
            .when('password', {
                is: (password) => (password && password.length > 0 ? true : false),
                then: Yup.string().oneOf([Yup.ref('password')]),
            }),
        });

        await validationSchema.validate(req.body, { abortEarly: false });

        return next();

    } catch(err) {
        return res
        .status(400)
        .json({ error: 'Validation fails', messages: err.inner });
    };
};