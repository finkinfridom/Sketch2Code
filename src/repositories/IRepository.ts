import { IComponent } from "./IComponent";

export interface IRepository {
	loadComponents(): Promise<IComponent[]>;
	findComponent(name: string): IComponent | undefined;
}
