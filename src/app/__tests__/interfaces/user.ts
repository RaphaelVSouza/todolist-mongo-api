import { Document } from "mongoose";
import { IUser } from "../../interfaces/user";

interface IUserTest extends IUser, Document {
  _id: string,
  name: string,
  email: string,
  password: string,
  confirmPassword?: string,
  isVerified?: boolean,
}

export { IUserTest }
