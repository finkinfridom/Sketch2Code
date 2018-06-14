import { IRepository } from "../IRepository";
import { IComponent } from "../IComponent";
import url = require("url");
import { GithubComponent } from "./GithubComponent";
import { IHttpWrapper } from "../../wrappers/HttpWrapper";
import { RequestOptions } from "https";
import dotenv = require("dotenv");
dotenv.config();

// https://api.github.com/repos/finkinfridom/sketch2code/contents/demo/components
export class GithubRepository implements IRepository {
	private components: IComponent[];
	constructor(
		readonly gitRepoUrl: string,
		readonly httpWrapper: IHttpWrapper
	) {}
	async loadComponents(): Promise<IComponent[]> {
		this.components = [];
		await this.traverseRepoContent(this.gitRepoUrl);
		return this.components;
	}
	async traverseRepoContent(repoUrl: string): Promise<void> {
		const optionsUrl = url.parse(repoUrl);
		const options = {
			headers: {
				"User-Agent": "Sketch2Code-App",
				Authorization:
					"Basic " +
					new Buffer(process.env.GIT_USER + ":" + process.env.GIT_PWD).toString(
						"base64"
					)
			},
			host: optionsUrl.host,
			path: optionsUrl.path
		} as RequestOptions;
		const response = await this.httpWrapper.get(options);
		const body = JSON.parse(response);
		if (body instanceof Array) {
			for (const item of body) {
				await this.traverseRepoContent(item.url);
			}
		} else {
			this.components.push(new GithubComponent(body.content, body.name));
		}
	}
	findComponent(name: string): IComponent | undefined {
		return this.components.find(
			c => c.name.toLowerCase() === name.toLowerCase()
		);
	}
}
