import { IZipWrapper, ZipFile } from "../../src/wrappers/ZipWrapper";
import jsZip = require("jszip");

export class MockZipWrapper implements IZipWrapper {
	constructor(readonly err?: any, readonly zip?: any) {}
	readText(zipFile: jsZip.JSZipObject): Promise<any> {
		return new Promise((resolve, reject) =>
			resolve(this.zip.files[zipFile.name].content)
		);
	}
	async loadAsync(data: string): Promise<any> {
		return new Promise((resolve, reject) => {
			if (this.err) {
				reject(this.err);
				return;
			}
			resolve(this.zip);
		});
	}
}
