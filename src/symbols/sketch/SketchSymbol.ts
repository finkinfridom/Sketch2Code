import { ISymbol } from "../ISymbol";
import { IComponent } from "../../repositories/IComponent";

export class SketchSymbol implements ISymbol {
	component: IComponent;
	constructor(readonly name: string, readonly attributes?: string[]) {}
	renderMeta() {
		return [
			"<",
			this.name,
			" attributes=",
			JSON.stringify(this.attributes),
			"></",
			this.name,
			">"
		].join("");
	}
}
