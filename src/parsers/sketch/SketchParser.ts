import { IParser } from "../IParser";
import { ISymbol } from "../../symbols/ISymbol";
import { IFSWrapper } from "../../wrappers/FSWrapper";
import { SketchSymbol } from "../../symbols/sketch/SketchSymbol";
import { IZipWrapper } from "../../wrappers/ZipWrapper";

export class SketchParser implements IParser {
	private parserRegexp: RegExp;
	constructor(
		readonly fsWrapper: IFSWrapper,
		readonly zipWrapper: IZipWrapper
	) {
		this.parserRegexp = new RegExp(/<([\w-]*)>/gi);
	}
	read(file?: string): Promise<any> {
		return new Promise((reject, resolve) => {
			if (!file) {
				reject(new Error("file argument is undefined"));
				return;
			}
			this.fsWrapper.readFile(file, { encoding: "utf8" }, (err, data) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(data);
			});
		});
	}

	loadPackage(pkg: string) {
		return this.zipWrapper.loadAsync(pkg).then(zip => {
			const promises = [];
			const paths = Object.keys(zip.files);
			for (const path of paths) {
				promises.push(this.zipWrapper.readText(zip, path));
			}
			return Promise.all(promises);
		});
	}

	parse(data: string): ISymbol[] {
		const symbolList = [] as ISymbol[];
		while (true) {
			const match = this.parserRegexp.exec(data);
			if (!match) {
				break;
			}
			const group = match[1];
			data = data.replace(match[0], "");
			symbolList.push(new SketchSymbol(group));
		}
		return symbolList;
	}
}
