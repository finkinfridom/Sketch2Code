import dotenv = require("dotenv");
dotenv.config();
import debug = require("debug");
const dbg = debug("routes");
import * as util from "util";
import * as express from "express";
import fs = require("fs");
import path = require("path");
import multer = require("multer");
import { SketchParser } from "../../parsers/sketch/SketchParser";
import { FSWrapper } from "../../wrappers/FSWrapper";
import { ZipWrapper } from "../../wrappers/ZipWrapper";
import { SymbolFactory } from "../../symbols/sketch/SymbolFactory";
const app = express();
app.set("view engine", "pug");
app.set("views", "./src/server/views");
const upload = multer({ dest: "uploads/" });
const distFolder = process.env.DIST_FOLDER || "./dist";

export class Upload {
	constructor() {
		if (!fs.existsSync(distFolder)) {
			fs.mkdirSync(distFolder);
			dbg("created distFolder" + distFolder);
		}
	}
	get routes() {
		app.get("/dist/:folder", (req, res) => {
			const folder = req.params.folder;
			fs.readFile(
				path.join(distFolder, folder, [folder, ".meta"].join("")),
				{ encoding: "utf8" },
				(err, data) => {
					res.render("dist", {
						title: "Sketch2Code - " + folder,
						folder,
						metaContent: data
					});
				}
			);
		});
		app.post("/process", upload.single("sketch"), async (req, res, next) => {
			if (req.file) {
				dbg(util.inspect(req.file));
				if (req.file.size === 0) {
					return next(new Error("Hey, first would you select a file?"));
				}

				fs.exists(req.file.path, async (exists: any) => {
					if (exists) {
						const file = req.file.path;
						const parser = new SketchParser(new FSWrapper(), new ZipWrapper());
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
							return next(new Error("No metaFile found"));
						}
						if (!metaFile.content) {
							dbg("metaFile.content is undefined");
						}
						const symbols = SymbolFactory.parse(metaFile.content);
						dbg(symbols);
						const distMetaFile = path.join(
							outFolder,
							parsedPath.name + ".meta"
						);
						fs.writeFileSync(distMetaFile, SymbolFactory.toString(symbols));
						res.redirect("/");
					} else {
						res.end(
							"Well, there is no magic for those who don’t believe in it!"
						);
					}
				});
				return;
			}
			res.end();
		});
		return app;
	}
}
