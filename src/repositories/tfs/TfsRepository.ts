import { IRepository } from "../IRepository";
import { IComponent } from "../IComponent";
import { IHttpWrapper } from "../../wrappers/HttpWrapper";

export class TfsRepository implements IRepository {
	private components: IComponent[];
	constructor(
		readonly collectionUrl: string,
		readonly httpWrapper: IHttpWrapper
	) {
		this.components = [];
	}
	async loadComponents(): Promise<IComponent[]> {
		this.components = JSON.parse(
			await this.httpWrapper.get(this.collectionUrl)
		) as IComponent[];
		return this.components;
	}
	findComponent(name: string): IComponent | undefined {
		return this.components.find(c => c.name === name);
	}
}
