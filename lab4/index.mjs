import express from "express";
import fetch from "node-fetch";

const planets = (await import("npm-solarsystem")).default;  // Use this syntax if packages uses "require"
const app = express();

app.set("view engine", "ejs");      // "ejs" templating engine will render JS to HTML
app.use(express.static("public"));  // Specifies folder for static files (e.g., img, css, etc.)

// Root route
app.get("/", async (req, res) => {
    let apiKey = "wxg4-DoKi_bl-fmABGFxpdXkPypq3xfKUht7HzcsrQk";
    let url = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&featured=true&query=solar-system`;
    let response = await fetch(url);
    let data = await response.json();
    let randomImage = data.urls.full;
    res.render("index", {randomImage});
});

app.get("/planet", (req, res) => {
    let planetName = req.query.planetName;
    let planetInfo = planets[`get${planetName}`]();
    res.render("planet", {planetInfo, planetName});
});

app.get("/nasa", async (req, res) => {
    let apiKey = "6pCUGMkDIfWWRXGxqJ0xhdr2IHXdUBG0pdcZxpOm";
    let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
    let response = await fetch(url);
    let data = await response.json();
    res.render("nasa", {data});
});

app.listen(3000, () => {
    console.log("Server started.");
});