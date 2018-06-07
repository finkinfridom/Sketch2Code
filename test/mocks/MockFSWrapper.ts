import { IFSWrapper } from "../../src/wrappers/FSWrapper";

export class MockFSWrapper implements IFSWrapper {
	constructor(readonly err?: NodeJS.ErrnoException, readonly data?: string) {}
	readFile(
		path: string,
		options: string | { encoding?: string; flag?: string } | null | undefined,
		callback: (err: NodeJS.ErrnoException, data: string | Buffer) => void
	): void {
		callback(
			this.err as NodeJS.ErrnoException,
			(this.data ? Buffer.from(this.data) : undefined) as Buffer
		);
	}
}
