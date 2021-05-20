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
            name: Yup.string().min(3).max(100).required(),
            email: Yup.string().email().min(3).max(100).required(),
            password: Yup.string().min(3).max(100).required(),
            confirmPassword: Yup.string().when('password', {
                is: (password) => !!(password && password.length > 0),
                then: Yup.string()
                    .required()
                    .oneOf([Yup.ref('password')])
            })
        });
        await validationSchema.validateSync(req.body, { abortEarly: false });
        next();
    }
    catch (error) {
        return res
            .status(400)
            .json({ error: 'Validation fails', messages: error.inner });
    }
};
