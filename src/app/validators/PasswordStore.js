import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const validationSchema = Yup.object().shape({
      email: Yup.string().email().min(1).max(100)
        .required(),
    });

    await validationSchema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res.status(400).json({ error: 'Validation fails', messages: err.inner });
  }
};
