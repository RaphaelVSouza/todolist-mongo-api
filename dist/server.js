"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const routes_1 = __importDefault(require("./routes"));
if (process.env.NODE_ENV !== 'production') {
    console.warn('\x1b[33m', "If you are in production, don't forget to change the node environment");
}
const PORT = process.env.PORT || 3333;
routes_1.default.listen(PORT, () => {
    console.log('\x1b[37m', `Server running on localhost:${PORT}`);
});
