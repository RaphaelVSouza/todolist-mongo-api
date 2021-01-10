export default async (req, res, next) => {
  res.boom.notFound('Page not found.');
  next();
};
