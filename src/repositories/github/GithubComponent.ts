import { IComponent } from "../IComponent";
import path = require("path");
export class GithubComponent implements IComponent {
	name: string;
	code: string;
	constructor(base64Content: string, fileName: string) {
		this.code = Buffer.from(base64Content, "base64").toString("binary");
		this.name = path.parse(fileName).name;
	}
}
