"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Yup = __importStar(require("yup"));
exports.default = async (req, res, next) => {
    try {
        const validationSchema = Yup.object().shape({
            title: Yup.string().min(1).max(100),
            description: Yup.string().min(1).max(100),
            tasks: Yup.array()
                .of(Yup.object().shape({
                title: Yup.string(),
            }))
                .min(0)
                .max(50),
        });
        await validationSchema.validate(req.body, { abortEarly: false });
        next();
    }
    catch (err) {
        return res.status(400).json({ error: 'Validation fails', messages: err.inner });
    }
};
