import { ISymbol } from "../ISymbol";

export class SketchSymbol implements ISymbol {
	constructor(readonly name: string) {}
	renderMeta() {
		return ["<", this.name, "></", this.name, ">"].join("");
	}
}
