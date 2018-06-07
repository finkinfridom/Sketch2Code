import jsZip = require("jszip");

export class ZipWrapper implements IZipWrapper {
	async loadAsync(pkg: string | Uint8Array): Promise<jsZip> {
		return await jsZip.loadAsync(pkg, { createFolders: true });
	}
	async readText(zip: jsZip, path: string): Promise<any> {
		return new Promise((resolve, reject) => {
			zip
				.file(path)
				.async("text")
				.then(content => {
					resolve(new ZipFile(path, content));
				})
				.catch(reject);
		});
	}
}

export class ZipFile {
	constructor(readonly file: string, readonly content: string) {}
}

export interface IZipWrapper {
	loadAsync(pkg: string | Uint8Array): Promise<any>;
	readText(zip: jsZip, path: string): Promise<ZipFile>;
}
