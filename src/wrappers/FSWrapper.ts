import fs = require("fs");
export class FSWrapper implements IFSWrapper {
	readFile(
		path: string,
		options:
			| string
			| {
					encoding?: string;
					flag?: string | undefined;
			  }
			| null
			| undefined,
		callback: (err: NodeJS.ErrnoException, data: string | Buffer) => void
	): void {
		fs.readFile(path, options, callback);
	}
}

export interface IFSWrapper {
	readFile(
		path: string,
		options:
			| string
			| {
					encoding?: string;
					flag?: string | undefined;
			  }
			| null
			| undefined,
		callback: (err: NodeJS.ErrnoException, data: string | Buffer) => void
	): void;
}
