import { SketchSymbol } from "./SketchSymbol";
import { ISymbol } from "../ISymbol";

export class SymbolFactory {
	static parse(content?: string): ISymbol[] {
		if (!content) {
			return [];
		}
		const metaContent = JSON.parse(content);
		const artboards = metaContent.pagesAndArtboards;
		const artboardsKeys = Object.keys(artboards);
		const result = [];
		for (const key of artboardsKeys) {
			const artboard = artboards[key].artboards;
			const artKeys = Object.keys(artboard);
			for (const artboardKey of artKeys) {
				result.push(SymbolFactory.createSymbol(artboard[artboardKey].name));
			}
		}
		return result;
	}
	static createSymbol(name: string): ISymbol {
		const whiteSpacesCount = (name.match(/\s/gi) || []).length;
		let newName = name;
		let symbolAttributes;
		if (whiteSpacesCount > 1) {
			const nameParts = newName.split(" ");
			symbolAttributes = nameParts.splice(2);
			newName = nameParts.join(" ");
		}
		return new SketchSymbol(
			SymbolFactory.normalizeName(newName),
			symbolAttributes
		);
	}
	static toString(symbols: ISymbol[]): string {
		const buffer = ["<metas>"] as string[];
		symbols.forEach(symbol => {
			buffer.push(symbol.renderMeta());
		});
		buffer.push("</metas>");
		return buffer.join("\r\n");
	}
	private static normalizeName(name: string) {
		return name
			.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
				return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
			})
			.replace(/\s+/g, "");
	}
}
