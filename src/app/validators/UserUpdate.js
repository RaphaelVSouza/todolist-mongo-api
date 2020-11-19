const Yup = require('yup');

module.exports = async (req, res, next) => {

    try {
        const validationSchema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string(),
            password: Yup.string().when('oldPassword', {
              is: (oldPassword) =>
                oldPassword && oldPassword.length > 0 ? true : false,
              then: Yup.string().required(),
            }),
            confirmPassword: Yup.string().when('password', {
              is: (password) => (password && password.length > 0 ? true : false),
              then: Yup.string()
                .required()
                .oneOf([Yup.ref('password')]),
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