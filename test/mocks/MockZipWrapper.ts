import { IZipWrapper } from "../../src/wrappers/ZipWrapper";
import jsZip = require("jszip");

export class MockZipWrapper implements IZipWrapper {
	readText(jsZip: jsZip, path: string): Promise<any> {
		return new Promise((resolve, reject) =>
			resolve(this.zip.files[path].content)
		);
	}
	constructor(readonly err?: any, readonly zip?: any) {}
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
