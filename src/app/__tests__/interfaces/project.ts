import { Document } from "mongoose";
import { IProject } from "../../interfaces/project";

interface IProjectTest extends IProject, Document {

  user_id: string,
  title: string,
  tasks?: Array<string>
}

export { IProjectTest }
