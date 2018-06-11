import dotenv = require("dotenv");
dotenv.config();
import glob = require("glob");
import debug = require("debug");
const dbg = debug("cli");
import fs = require("fs");
import path = require("path");
import { SketchParser } from "./parsers/sketch/SketchParser";
import { FSWrapper } from "./wrappers/FSWrapper";
import { ZipWrapper, ZipFile } from "./wrappers/ZipWrapper";
import { SymbolFactory } from "./symbols/sketch/SymbolFactory";
const distFolder = process.env.DIST_FOLDER || "./dist";
if (!fs.existsSync(distFolder)) {
	fs.mkdirSync(distFolder);
	dbg("created distFolder" + distFolder);
}
const parser = new SketchParser(new FSWrapper(), new ZipWrapper());
glob("samples/**/*.sketch", (err, files) => {
	if (err) {
		console.error(err);
		return;
	}
	files.forEach(async file => {
		const parsedPath = path.parse(file);
		const outFolder = path.join(distFolder, parsedPath.name);
		if (!fs.existsSync(outFolder)) {
			fs.mkdirSync(outFolder);
			dbg("Created dir:" + outFolder);
		}
		const distFile = path.join(outFolder, parsedPath.base);
		fs.copyFileSync(file, distFile);
		dbg("copied sketch to " + distFile);
		const zipFiles = await parser.getZipFiles(distFile);
		dbg("found # files:", zipFiles.length);
		const metaFile = zipFiles.find(zFile => {
			return zFile.file === "meta.json";
		});
		if (!metaFile) {
			dbg("metaFile is undefined");
			return;
		}
		if (!metaFile.content) {
			dbg("metaFile.content is undefined");
		}
		const symbols = SymbolFactory.parse(metaFile.content);
		dbg(symbols);
		const distMetaFile = path.join(outFolder, parsedPath.name + ".meta");
		fs.writeFileSync(distMetaFile, SymbolFactory.toString(symbols));
	});
});
