import jsZip = require("jszip");

export class ZipWrapper implements IZipWrapper {
	async loadAsync(pkg: string | Uint8Array): Promise<jsZip> {
		return await jsZip.loadAsync(pkg, { createFolders: true });
	}
	async readText(zipFile: jsZip.JSZipObject): Promise<any> {
		return new Promise((resolve, reject) => {
			if (!zipFile) {
				return resolve(new ZipFile(undefined, undefined));
			}
			zipFile
				.async("text")
				.then(content => {
					resolve(new ZipFile(zipFile.name, content));
				})
				.catch(reject);
		});
	}
}

export class ZipFile {
	constructor(readonly file?: string, readonly content?: string) {}
}

export interface IZipWrapper {
	loadAsync(pkg: string | Uint8Array): Promise<any>;
	readText(zipFile: jsZip.JSZipObject): Promise<ZipFile>;
}
