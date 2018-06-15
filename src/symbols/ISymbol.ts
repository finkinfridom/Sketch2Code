import { IComponent } from "../repositories/IComponent";

export interface ISymbol {
	name: string;
	attributes?: string[];
	component?: IComponent;
	renderMeta(): string;
}
