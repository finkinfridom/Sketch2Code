import { IFSWrapper } from "../../src/wrappers/FSWrapper";

export class MockFSWrapper implements IFSWrapper {
	constructor(readonly err?: NodeJS.ErrnoException, readonly data?: string) {}
	readFile(
		path: string,
		options: string | { encoding: string; flag?: string },
		callback: (err: NodeJS.ErrnoException, data: string) => void
	): void {
		callback(this.err as NodeJS.ErrnoException, this.data as string);
	}
}
