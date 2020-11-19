module.exports = async(req, res, next) => {
    res.status(404).send('Sorry cant find that!');
    next();
}
