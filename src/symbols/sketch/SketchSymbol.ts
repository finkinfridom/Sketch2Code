import { ISymbol } from "../ISymbol";

export class SketchSymbol implements ISymbol {
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
