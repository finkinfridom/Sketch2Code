import { ISymbol } from "../symbols/ISymbol";

export interface IParser {
	read(file?: string): Promise<any>;
	loadPackage(data: string): Promise<any>;
	parse(data: string): ISymbol[];
}
