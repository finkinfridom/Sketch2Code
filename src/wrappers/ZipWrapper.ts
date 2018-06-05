import jsZip = require("jszip");

export class ZipWrapper implements IZipWrapper {
	async loadAsync(pkg: string): Promise<jsZip> {
		return await jsZip.loadAsync(pkg);
	}
	async readText(zip: jsZip, path: string): Promise<string> {
		return await zip.file(path).async("text");
	}
}

export interface IZipWrapper {
	loadAsync(pkg: string): Promise<any>;
	readText(zip: jsZip, path: string): Promise<string>;
}
