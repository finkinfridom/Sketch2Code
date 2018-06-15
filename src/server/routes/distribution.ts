import dotenv = require("dotenv");
dotenv.config();
import debug = require("debug");
const dbg = debug("routes:distribution");
import * as express from "express";
import fs = require("fs");
import path = require("path");
import { SketchParser } from "../../parsers/sketch/SketchParser";
import { FSWrapper } from "../../wrappers/FSWrapper";
import { ZipWrapper } from "../../wrappers/ZipWrapper";
import { HttpWrapper } from "../../wrappers/HttpWrapper";
import { GithubRepository } from "../../repositories/github/GithubRepository";
import { TfsRepository } from "../../repositories/tfs/TfsRepository";
import { IComponent } from "../../repositories/IComponent";
import { ISymbol } from "../../symbols/ISymbol";
const app = express();
app.set("view engine", "pug");
app.set("views", "./src/server/views");
const distFolder = process.env.DIST_FOLDER || "./dist";
const parser = new SketchParser(new FSWrapper(), new ZipWrapper());
const httpWrapper = new HttpWrapper();
const getSymbols = (folder: string): Promise<ISymbol[]> => {
	return new Promise((resolve, reject) => {
		fs.readFile(
			path.join(distFolder, folder, [folder, ".meta"].join("")),
			{ encoding: "utf8" },
			(err, data) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(parser.parse(data));
			}
		);
	});
};
export class Distribution {
	get routes() {
		app.get("/dist/:folder", async (req, res) => {
			const folder = req.params.folder;
			const symbols = await getSymbols(folder);
			res.render("dist", {
				title: "Sketch2Code - " + folder,
				folder,
				symbols,
				components: []
			});
		});
		app.get("/dist/:folder/repo", async (req, res) => {
			const folder = req.params.folder;
			const symbols = await getSymbols(folder);
			const repoUrl = req.query.url;
			const repoInstance =
				repoUrl.indexOf("github") > -1
					? new GithubRepository(repoUrl, httpWrapper)
					: new TfsRepository(repoUrl, httpWrapper);
			let components = [] as IComponent[];
			try {
				components = await repoInstance.loadComponents();
			} catch (e) {
				dbg(e);
			}
			symbols.forEach((symbol: ISymbol) => {
				const componentForSymbol = components.find(
					c => c.name.toLowerCase() === symbol.name.toLowerCase()
				);
				symbol.component = componentForSymbol;
			});
			res.render("dist", {
				title: "Sketch2Code - " + folder,
				folder,
				symbols,
				components
			});
		});
		return app;
	}
}
