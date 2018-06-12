import "mocha";
import { expect } from "chai";
import { SketchParser } from "../../../src/parsers/sketch/SketchParser";
import { MockFSWrapper } from "../../mocks/MockFSWrapper";
import { ISymbol } from "../../../src/symbols/ISymbol";
import { MockZipWrapper } from "../../mocks/MockZipWrapper";
import { JSZipObject } from "jszip";
const data = "<test attributes=></test><anotherTest attributes=></anotherTest>";
const multipleMetas =
	'<metas><videoPlayer attributes=></videoPlayer><photoGallery attributes=></photoGallery><mediaObject attributes=["horizontal"]></mediaObject><headlineStack attributes=></headlineStack><mediaObject attributes=["vertical"]></mediaObject></metas>';
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
			"<test attributes=></test><anotherTest attributes=></anotherTest>"
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
		expect(symbols[1].name).to.be.equal("anotherTest");
	});
	it("should parse multiple symbols", () => {
		const symbols = parser.parse(multipleMetas) as ISymbol[];
		expect(symbols).to.be.lengthOf(5);
		expect(symbols[0].name).to.be.equal("videoPlayer");
		expect(symbols[1].name).to.be.equal("photoGallery");
		expect(symbols[2].name).to.be.equal("mediaObject");
	});
});
