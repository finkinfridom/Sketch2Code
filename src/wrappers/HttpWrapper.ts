import axios from "axios";

export class HttpWrapper implements IHttpWrapper {
	async get(url: string): Promise<any> {
		return axios.get(url);
	}
}
export interface IHttpWrapper {
	get(url: string): Promise<any>;
}
