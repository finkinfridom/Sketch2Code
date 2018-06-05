import { SketchSymbol } from "../../../src/symbols/sketch/SketchSymbol";
import "mocha";
import { expect } from "chai";

const testSymbol = new SketchSymbol("test");
describe("SketchSymbol", () => {
	it("should render <test></test>", () => {
		expect(testSymbol.renderMeta()).to.be.equal("<test></test>");
	});
});
