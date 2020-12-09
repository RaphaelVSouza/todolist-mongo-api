import * as Yup from 'yup';
export default async (req, res, next) => {

    try {
        const validationSchema = Yup.object().shape({
            title: Yup.string(),
            description: Yup.string(),
            tasks: Yup.array().of(Yup.object().shape({
                    title: Yup.string(),
                  })).min(1),
    })

        await validationSchema.validate(req.body, { abortEarly: false });

        return next();

    } catch(err) {
        return res
        .status(400)
        .json({ error: 'Validation fails', messages: err.inner });
    };
};
