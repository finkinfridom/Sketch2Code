import dotenv = require("dotenv");
dotenv.config();
import debug = require("debug");
const dbg = debug("server");
import * as express from "express";
import { Upload } from "./routes/upload";
const app = express();
const port = process.env.PORT || 3000;

app.use(new Upload().routes);
app.set("view engine", "pug");
app.set("views", "./src/server/views");
app.get("/", (req, res) => {
	res.render("index", { title: "Sketch2Code" });
});
app.listen(port, function() {
	dbg("App listening at port:" + port);
});
