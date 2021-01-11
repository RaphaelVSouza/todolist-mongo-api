import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const validationSchema = Yup.object().shape({
      password: Yup.string().min(3).max(100).required(),
      confirmPassword: Yup.string()
        .required()
        .when('password', {
          is: (password) => !!(password && password.length > 0),
          then: Yup.string().oneOf([Yup.ref('password')]),
        }),
    });

    await validationSchema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res.status(400).json({ error: 'Validation fails', messages: err.inner });
  }
};
