import { IParser } from "../IParser";
import { ISymbol } from "../../symbols/ISymbol";
import { IFSWrapper } from "../../wrappers/FSWrapper";
import { SketchSymbol } from "../../symbols/sketch/SketchSymbol";
import { IZipWrapper, ZipFile } from "../../wrappers/ZipWrapper";

export class SketchParser implements IParser {
	private parserRegexp: RegExp;
	constructor(
		readonly fsWrapper: IFSWrapper,
		readonly zipWrapper: IZipWrapper
	) {
		this.parserRegexp = new RegExp(/<([\w-]*) (attributes=(["\w\[\]]*))>/gim);
	}
	read(file?: string): Promise<any> {
		return new Promise((resolve, reject) => {
			if (!file) {
				reject(new Error("file argument is undefined"));
				return;
			}
			this.fsWrapper.readFile(file, undefined, (err, data) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(data);
			});
		});
	}

	loadPackage(pkg: string | Uint8Array) {
		return this.zipWrapper.loadAsync(pkg).then(zip => {
			const promises = [];
			const paths = Object.keys(zip.files);
			for (const path of paths) {
				promises.push(this.zipWrapper.readText(zip.file(path)));
			}
			return Promise.all(promises);
		});
	}

	parse(data: string): ISymbol[] {
		const symbolList = [] as ISymbol[];
		while (true) {
			this.parserRegexp.lastIndex = 0;
			const match = this.parserRegexp.exec(data);
			if (!match) {
				break;
			}
			const name = match[1];
			console.log(name, match);
			data = data.replace(match[0], "");
			const attributes = match[3];
			symbolList.push(
				new SketchSymbol(name, attributes ? JSON.parse(attributes) : undefined)
			);
		}
		return symbolList;
	}
	async getZipFiles(file?: string): Promise<ZipFile[]> {
		const fileData = await this.read(file);
		return await this.loadPackage(fileData);
	}
}
