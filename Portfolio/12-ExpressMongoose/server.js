const express = require("express");
const app = express();
const mongoose = require("mongoose");
const fs = require("fs");
const csv = require("csv-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const mongoUrl = "mongodb://127.0.0.1:27017/f1";
mongoose.connect(mongoUrl);

// Definition of a schema
const teamSchema = new mongoose.Schema({
  id: Number,
  name: String,
  nationality: String,
  url: String,
});
teamSchema.set("strictQuery", true);

const driverSchema = new mongoose.Schema({
  num: Number,
  code: String,
  forename: String,
  surname: String,
  dob: Date,
  nationality: String,
  url: String,
  team: teamSchema,
});
driverSchema.set("strictQuery", true);

const Team = mongoose.model("Team", teamSchema);
const Driver = mongoose.model("Driver", driverSchema);

let countries = [
  { code: "ENG", label: "England" },
  { code: "SPA", label: "Spain" },
  { code: "GER", label: "Germany" },
  { code: "FRA", label: "France" },
  { code: "MEX", label: "Mexico" },
  { code: "AUS", label: "Australia" },
  { code: "FIN", label: "Finland" },
  { code: "NET", label: "Netherlands" },
  { code: "CAN", label: "Canada" },
  { code: "MON", label: "Monaco" },
  { code: "THA", label: "Thailand" },
  { code: "JAP", label: "Japan" },
  { code: "CHI", label: "China" },
  { code: "USA", label: "USA" },
  { code: "DEN", label: "Denmark" },
  { code: "British", label: "British" },
  { code: "Spanish", label: "Spanish" },
  { code: "German", label: "German" },
  { code: "French", label: "French" },
  { code: "Mexican", label: "Mexican" },
  { code: "Australian", label: "Australian" },
  { code: "Finnish", label: "Finnish" },
  { code: "Dutch", label: "Dutch" },
  { code: "Canadian", label: "Canadian" },
  { code: "Monegasque", label: "Monegasque" },
  { code: "Thai", label: "Thai" },
  { code: "Japanese", label: "Japanese" },
  { code: "Chinese", label: "Chinese" },
  { code: "American", label: "American" },
  { code: "Danish", label: "Danish" },
];

// Team mapping for CSV data
const teamMapping = {
  "Mercedes": { name: "Mercedes", nationality: "German", url: "http://en.wikipedia.org/wiki/Mercedes-Benz_in_Formula_One" },
  "Aston Martin": { name: "Aston Martin", nationality: "British", url: "http://en.wikipedia.org/wiki/Aston_Martin_in_Formula_One" },
  "Alpine": { name: "Alpine", nationality: "French", url: "http://en.wikipedia.org/wiki/Alpine_F1_Team" },
  "Haas": { name: "Haas", nationality: "American", url: "http://en.wikipedia.org/wiki/Haas_F1_Team" },
  "Red Bull": { name: "Red Bull", nationality: "Austrian", url: "http://en.wikipedia.org/wiki/Red_Bull_Racing" },
  "Alpha Tauri": { name: "Alpha Tauri", nationality: "Italian", url: "http://en.wikipedia.org/wiki/Scuderia_AlphaTauri" },
  "Alpha Romeo": { name: "Alfa Romeo", nationality: "Swiss", url: "http://en.wikipedia.org/wiki/Alfa_Romeo_in_Formula_One" },
  "Ferrari": { name: "Ferrari", nationality: "Italian", url: "http://en.wikipedia.org/wiki/Scuderia_Ferrari" },
  "Williams": { name: "Williams", nationality: "British", url: "http://en.wikipedia.org/wiki/Williams_Grand_Prix_Engineering" },
  "McLaren": { name: "McLaren", nationality: "British", url: "http://en.wikipedia.org/wiki/McLaren" },
};

// Middleware to load CSV data into database on first run
async function loadInitialData(req, res, next) {
  try {
    const driverCount = await Driver.countDocuments();
    
    if (driverCount === 0) {
      console.log("Loading initial data from CSV...");
      
      // First, create teams
      const teamMap = {};
      for (const [key, value] of Object.entries(teamMapping)) {
        const team = await Team.findOne({ name: value.name });
        if (!team) {
          const newTeam = new Team({
            id: Object.keys(teamMap).length + 1,
            name: value.name,
            nationality: value.nationality,
            url: value.url,
          });
          await newTeam.save();
          teamMap[key] = newTeam;
        } else {
          teamMap[key] = team;
        }
      }
      
      // Then load drivers from CSV
      await new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(__dirname + "/public/data/f1_2023.csv")
          .pipe(csv())
          .on("data", (data) => {
            // Handle BOM in CSV - the first column might have a BOM character
            const number = data.number || data['﻿number'];
            if (number && data.code && data.forename) {
              // Normalize the data by removing BOM from keys
              results.push({
                number: number,
                code: data.code,
                forename: data.forename,
                surname: data.surname,
                dob: data.dob,
                nationality: data.nationality,
                url: data.url,
                current_team: data.current_team
              });
            }
          })
          .on("end", async () => {
            try {
              for (const row of results) {
                if (row.current_team && row.current_team !== "N/A") {
                  const team = teamMap[row.current_team];
                  if (!team) {
                    console.log(`Team not found for: ${row.current_team}`);
                    continue;
                  }
                  
                  const [day, month, year] = row.dob.split("/");
                  const dob = new Date(`${year}-${month}-${day}`);
                  
                  const driver = new Driver({
                    num: parseInt(row.number),
                    code: row.code,
                    forename: row.forename,
                    surname: row.surname,
                    dob: dob,
                    nationality: row.nationality,
                    url: row.url,
                    team: {
                      id: team.id,
                      name: team.name,
                      nationality: team.nationality,
                      url: team.url,
                      _id: team._id
                    },
                  });
                  await driver.save();
                }
              }
              console.log(`Initial data loaded successfully! ${results.length} rows processed.`);
              resolve();
            } catch (err) {
              console.error("Error in CSV processing:", err);
              reject(err);
            }
          })
          .on("error", reject);
      });
    }
    next();
  } catch (err) {
    console.error("Error loading initial data:", err);
    next();
  }
}

app.get("/", loadInitialData, async (req, res) => {
  try {
    const drivers = await Driver.find();
    const teams = await Team.find();
    res.render("index", { drivers, teams, countries });
  } catch (err) {
    res.status(500).send("Error loading data: " + err.message);
  }
});

// Get a specific driver
app.get("/driver/:id", async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or update a driver
app.post("/driver", async (req, res) => {
  try {
    const { driverId, num, code, name, lname, dob, url, nation, team } = req.body;
    
    const teamDoc = await Team.findById(team);
    
    if (driverId) {
      // Update existing driver
      await Driver.findByIdAndUpdate(driverId, {
        num: parseInt(num),
        code: code,
        forename: name,
        surname: lname,
        dob: new Date(dob),
        nationality: nation,
        url: url,
        team: teamDoc,
      });
    } else {
      // Create new driver
      const driver = new Driver({
        num: parseInt(num),
        code: code,
        forename: name,
        surname: lname,
        dob: new Date(dob),
        nationality: nation,
        url: url,
        team: teamDoc,
      });
      await driver.save();
    }
    
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error saving driver: " + err.message);
  }
});

// Delete a driver
app.delete("/driver/:id", async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, (err) => {
  console.log("Listening on port 3000");
});
