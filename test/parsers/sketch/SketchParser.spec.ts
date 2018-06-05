import "mocha";
import { expect } from "chai";
import { SketchParser } from "../../../src/parsers/sketch/SketchParser";
import { MockFSWrapper } from "../../mocks/MockFSWrapper";
import { ISymbol } from "../../../src/symbols/ISymbol";
import { MockZipWrapper } from "../../mocks/MockZipWrapper";

const data = "<test></test><another-test></another-test>";
const mockFsWrapper = new MockFSWrapper(undefined, data);
const zipData = {
	files: {
		test_file: { content: data }
	}
};
const mockZipWrapper = new MockZipWrapper(undefined, zipData);
const parser = new SketchParser(mockFsWrapper, mockZipWrapper);
describe("SketchParser", () => {
	it("should read file", done => {
		parser
			.read("test_file")
			.then(_readData =>
				expect(_readData).to.be.equal(
					"<test></test><another-test></another-test>"
				)
			)
			.catch(() => done());
	});
	it("should loadPackage", done => {
		parser
			.loadPackage("test_file.zip")
			.then(_zip => {
				expect(_zip).to.be.lengthOf(1);
				expect(_zip[0]).to.be.equal(data);
			})
			.catch(() => done());
	});
	it("should parse symbols", () => {
		const symbols = parser.parse(data) as ISymbol[];
		expect(symbols).to.be.lengthOf(2);
		expect(symbols[0].name).to.be.equal("test");
		expect(symbols[1].name).to.be.equal("another-test");
	});
});
