import jsZip = require("jszip");

export class ZipWrapper implements IZipWrapper {
	async loadAsync(data: string): Promise<jsZip> {
		return await jsZip.loadAsync(data);
	}
	async readText(zip: jsZip, path: string): Promise<string> {
		return await zip.file(path).async("text");
	}
}

export interface IZipWrapper {
	loadAsync(data: string): Promise<any>;
	readText(zip: jsZip, path: string): Promise<string>;
}
