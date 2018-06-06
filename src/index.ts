/*
//load input files
//parse loaded files
//look in repository for component
//save component in repo
*/
import dotenv = require("dotenv");
dotenv.config();
import glob = require("glob");
import debug = require("debug");
const dbg = debug("main");
import fs = require("fs");
import path = require("path");
import { SketchParser } from "./parsers/sketch/SketchParser";
import { FSWrapper } from "./wrappers/FSWrapper";
import { ZipWrapper } from "./wrappers/ZipWrapper";
const distFolder = process.env.DIST_FOLDER || "dist";
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
		const distFile = path.join(outFolder, parsedPath.name + ".zip");
		fs.copyFileSync(file, distFile);
		dbg("copied sketch to " + distFile);
		const fileData = parser.read(distFile);
		const zipFiles = await parser.loadPackage(await fileData);
		dbg("found files:" + zipFiles);
		const metaFile = zipFiles.find(zFile => {
			return zFile.file === "meta.json";
		});
		if (!metaFile) {
			dbg("metaFile is undefined");
			return;
		}
		dbg(metaFile.file);
		// const fileContent = await parser.read(metaFile.content);
		// dbg("fileContent" + JSON.stringify(fileContent));
	});
});
