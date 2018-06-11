import dotenv = require("dotenv");
dotenv.config();
import debug = require("debug");
const dbg = debug("server");
import * as express from "express";
import { Upload } from "./routes/upload";
import fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;
app.set("view engine", "pug");
app.set("views", "./src/server/views");

app.use(new Upload().routes);
app.get("/", (req, res) => {
	fs.readdir("dist", (err, items) => {
		res.render("index", { title: "Sketch2Code", dists: items });
	});
});
app.listen(port, function() {
	dbg("App listening at port:" + port);
});
