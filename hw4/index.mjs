import express from "express";
import fetch from "node-fetch";
import { faker } from "@faker-js/faker";

const dotenv = (await import("dotenv")).default;
dotenv.config();


// Init templating engine
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));


// Constants
const PORT = 3000;
const API_KEY = process.env.API_KEY;  // Hide my API key
const GAMES = [  // Personal choice of games to query with RAWG API
    {
        route: "factorio",
        slug: "factorio",
        name: "Factorio",
        id: 10926
    },
    {
        route: "stardew",
        slug: "stardew-valley",
        name: "Stardew Valley",
        id: 654
    },
    {
        route: "terraria",
        slug: "terraria",
        name: "Terraria",
        id: 422
    },
    {
        route: "starcraft",
        slug: "starcraft-2",
        name: "StarCraft II",
        id: 22510
    },
    {
        route: "wow",
        slug: "world-of-warcraft-wrath-of-the-lich-king",
        name: "World of Warcraft: Wrath of the Lich King",
        id: 38218
    },
];


// Generate routes for each game page
function initRoutes() {
    for (let g of GAMES) {
        app.get(`/${g.route}`, async (req, res) => {
            let response = await fetch(`https://api.rawg.io/api/games/${g.slug}?key=${API_KEY}`);
            let game = await response.json();

            // Shows fake reviews from usernames on each game page
            let reviews = [
                {
                    username: faker.internet.username(),
                    review: faker.lorem.sentences({min:1, max:3})
                },
                {
                    username: faker.internet.username(),
                    review: faker.lorem.sentences({min:1, max:3})
                }
            ];

            res.render("game", {game, reviews, GAMES});
        });
    }
}


// Homepage
app.get("/", (req, res) => {
    res.render("index", {GAMES});
});


// Generate routes
initRoutes();


// Init server
app.listen(3000, () => {
    console.log(`[SERVER] Listening on port ${PORT}`);
});