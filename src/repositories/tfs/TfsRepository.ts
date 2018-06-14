import { IRepository } from "../IRepository";
import { IComponent } from "../IComponent";
import { IHttpWrapper } from "../../wrappers/HttpWrapper";
import url = require("url");
import { RequestOptions } from "https";

export class TfsRepository implements IRepository {
	private components: IComponent[];
	constructor(
		readonly collectionUrl: string,
		readonly httpWrapper: IHttpWrapper
	) {
		this.components = [];
	}
	async loadComponents(): Promise<IComponent[]> {
		const optionsUrl = url.parse(this.collectionUrl);
		const options = {
			host: optionsUrl.host,
			path: optionsUrl.path
		} as RequestOptions;
		this.components = JSON.parse(
			await this.httpWrapper.get(options)
		) as IComponent[];
		return this.components;
	}
	findComponent(name: string): IComponent | undefined {
		return this.components.find(c => c.name === name);
	}
}
