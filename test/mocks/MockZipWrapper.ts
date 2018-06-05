import { IZipWrapper } from "../../src/wrappers/ZipWrapper";
import jsZip = require("jszip");

export class MockZipWrapper implements IZipWrapper {
	readText(jsZip: jsZip, path: string): Promise<string> {
		return new Promise((reject, resolve) =>
			resolve(this.zip.files[path].content)
		);
	}
	constructor(readonly err?: any, readonly zip?: any) {}
	async loadAsync(data: string): Promise<any> {
		return new Promise((reject, resolve) => {
			if (this.err) {
				reject(this.err);
				return;
			}
			resolve(this.zip);
		});
	}
}
