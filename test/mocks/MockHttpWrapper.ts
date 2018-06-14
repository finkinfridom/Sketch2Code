import { IHttpWrapper } from "../../src/wrappers/HttpWrapper";
import { RequestOptions } from "https";

export class MockHttpWrapper implements IHttpWrapper {
	constructor(readonly err?: any, readonly data?: string) {}
	get(options: RequestOptions): Promise<any> {
		return new Promise((resolve, reject) => {
			if (this.err) {
				reject(this.err);
				return;
			}
			resolve(this.data);
		});
	}
}
