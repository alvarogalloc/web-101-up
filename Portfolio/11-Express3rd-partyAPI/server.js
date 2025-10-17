const express = require("express");
const https = require("https");
const app = express();

const PORT = 3000;
const API_KEY = "b95adf6b6930cdea9800290ca566b4ff";

app.use(express.static(__dirname)); 
app.get("/weather", (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.send("City is required. <a href='/'>Go back</a>");
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  https.get(url, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      try {
        const weather = JSON.parse(data);

        if (weather.cod !== 200) {
          return res.send(`Error: ${weather.message} <a href='/'>Go back</a>`);
        }

        const temp = weather.main.temp;
        const description = weather.weather[0].description;
        const icon = weather.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

        res.send(`
        <style>
              body {
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    </style>

          <h1>Weather in ${city}</h1>
          <p>Temperature: ${temp}°C</p>
          <p>Description: ${description} <img src="${iconUrl}" alt="${description}"></p>
          <a href="/">Go back</a>
        `);
      } catch (err) {
        res.send(`Error parsing response <a href='/'>Go back</a>`);
      }
    });

  }).on("error", (err) => {
    res.send(`API call error: ${err.message} <a href='/'>Go back</a>`);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
