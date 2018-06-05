import { IHttpWrapper } from "../../src/wrappers/HttpWrapper";

export class MockHttpWrapper implements IHttpWrapper {
	constructor(readonly err?: any, readonly data?: string) {}
	get(url: string): Promise<any> {
		return new Promise((reject, resolve) => {
			if (this.err) {
				reject(this.err);
				return;
			}
			resolve(this.data);
		});
	}
}
