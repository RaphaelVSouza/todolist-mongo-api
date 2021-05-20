"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async (req, res, next) => {
    res.status(404).json({ error: 'Page not found.' });
    next();
};
