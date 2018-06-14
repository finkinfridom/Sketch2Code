import https = require("https");
import { RequestOptions } from "http";
export class HttpWrapper implements IHttpWrapper {
	async get(options: RequestOptions): Promise<any> {
		return new Promise((resolve, reject) => {
			https
				.get(options, res => {
					const chunks = [] as Buffer[];
					res.on("data", (chunk: Buffer) => {
						chunks.push(chunk);
					});
					res.on("end", () => {
						const buffer = Buffer.concat(chunks);
						resolve(buffer.toString());
					});
				})
				.on("error", reject);
		});
	}
}
export interface IHttpWrapper {
	get(options: RequestOptions): Promise<any>;
}
