const express = require("express");
const app = express();
const mongoose = require("mongoose");
const fs = require("fs");


// lo agregue porque csv puede tener varios separadores como ;,: entonces no quiero pelearme con eso y ademas implementarlo no es mi tema, esto es un crud
const csv = require("csv-parser");
require('dotenv').config();


// crud app for f1 drivers

const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URI;

mongoose.connect(mongoUrl).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

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
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
});
driverSchema.set("strictQuery", true);

const Team = mongoose.model("Team", teamSchema);
const Driver = mongoose.model("Driver", driverSchema);



// this could sent to the client to be a select but 197 elements are not good to hardcode
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

async function loadInitialData(req, res, next) {
  try {
    const driverCount = await Driver.countDocuments();
    
    if (driverCount === 0) {
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
      
      await new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(__dirname + "/public/data/f1_2023.csv")
          .pipe(csv())
          .on("data", (data) => {
            const number = data.number || data['number'];
            if (number && data.code && data.forename) {
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
                    console.error(`Team ${row.current_team} not found`);
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
                    team: team._id,
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
    const drivers = await Driver.find().populate('team');
    const teams = await Team.find();
    res.render("index", { drivers, teams, countries });
  } catch (err) {
    res.status(500).send("Error loading data: " + err.message);
  }
});

app.get("/driver/:id", async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).populate('team');
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or update a driver
// made throut the same form, if the primary key that now it is the driverid is already in the db,
// it just overrides the contents  of that driver
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

app.delete("/driver/:id", async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, (err) => {
  console.log(`Listening on port ${port}`);
});
