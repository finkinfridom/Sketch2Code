import "mocha";
import { expect } from "chai";
import { SketchParser } from "../../../src/parsers/sketch/SketchParser";
import { MockFSWrapper } from "../../mocks/MockFSWrapper";
import { ISymbol } from "../../../src/symbols/ISymbol";
import { MockZipWrapper } from "../../mocks/MockZipWrapper";
import { JSZipObject } from "jszip";
const data = "<test></test><another-test></another-test>";
const mockFsWrapper = new MockFSWrapper(undefined, data);
class zipData {
	private files: any;
	constructor(readonly data: string) {
		this.files = {
			test_file: { content: data }
		};
	}
	file(path: string) {
		return { name: path };
	}
}
const mockZipWrapper = new MockZipWrapper(undefined, new zipData(data));
const parser = new SketchParser(mockFsWrapper, mockZipWrapper);
describe("SketchParser", () => {
	it("should read file", async () => {
		const _readData = await parser.read("test_file");
		expect(_readData.toString()).to.be.equal(
			"<test></test><another-test></another-test>"
		);
	});
	it("should loadPackage", async () => {
		const _zip = await parser.loadPackage("test_file.zip");
		expect(_zip).to.be.lengthOf(1);
		expect(_zip[0]).to.be.equal(data);
	});
	it("should parse symbols", () => {
		const symbols = parser.parse(data) as ISymbol[];
		expect(symbols).to.be.lengthOf(2);
		expect(symbols[0].name).to.be.equal("test");
		expect(symbols[1].name).to.be.equal("another-test");
	});
});
