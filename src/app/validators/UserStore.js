import * as Yup from 'yup';

export default async (req, res, next) => {

    try {
        const validationSchema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required(),
            confirmPassword: Yup.string().when('password', {
              is: (password) => (password && password.length > 0 ? true : false),
              then: Yup.string()
                .required()
                .oneOf([Yup.ref('password')]),
            }),
          });

        await validationSchema.validateSync(req.body, { abortEarly: false });

        return next();

    } catch(err) {
        return res
        .status(400)
        .json({ error: 'Validation fails', messages: err.inner });
    };
};
