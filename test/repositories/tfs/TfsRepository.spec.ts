import "mocha";
import { expect } from "chai";
import { TfsRepository } from "../../../src/repositories/tfs/TfsRepository";
import { MockHttpWrapper } from "../../mocks/MockHttpWrapper";
import { IComponent } from "../../../src/repositories/IComponent";

const mockHttpWrapper = new MockHttpWrapper(
	undefined,
	JSON.stringify([
		{
			name: "component1",
			code: "public class Component1{}"
		}
	])
);
const repository = new TfsRepository(
	"https://tfs.repository.com",
	mockHttpWrapper
);
describe("TfsRepository", () => {
	it("should loadComponents", async () => {
		const _components = await repository.loadComponents();
		expect(_components).to.be.lengthOf(1);
		expect(_components[0].name).to.be.equal("component1");
	});
	it("should findComponent", async () => {
		const _components = repository.loadComponents();
		const component = repository.findComponent("component1");
		expect(component).to.not.be.undefined;
		expect((component || ({} as IComponent)).name).to.be.equal("component1");
	});
});
