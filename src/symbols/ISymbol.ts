export interface ISymbol {
	name: string;
	attributes?: string[];
	renderMeta(): string;
}
