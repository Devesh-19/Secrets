const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const userSchema = {
	email: String,
	password: String,
};

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
	res.render("home");
});

app.get("/login", (req, res) => {
	res.render("login");
});

app.get("/register", (req, res) => {
	res.render("register");
});

app.post("/register", (req, res) => {
	const newUser = new User({
		email: req.body.username,
		password: req.body.password,
	});

	newUser.save((err) => {
		if (err) {
			res.send(err);
		} else {
			res.render("secrets");
		}
	});
});

app.post("/login", (req, res) => {
	User.findOne({ email: req.body.username }, (err, foundUser) => {
		if (err) {
			res.send(err);
		} else {
			if (foundUser === null || foundUser === "") {
				res.send("User not found!");
			} else {
				if (foundUser.password == req.body.password) {
					res.render("secrets");
				} else {
					res.send("Wrong password! Try again.");
				}
			}
		}
	});
});

app.listen(3000, () => {
	console.log("Server started at 3000.");
});
