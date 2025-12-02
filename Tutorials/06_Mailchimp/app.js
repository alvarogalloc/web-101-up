const express = require("express");
const bodyParser = require("body-parser");
const https = require("https"); // Required for making HTTPS requests to Mailchimp API
require("dotenv").config(); // Load environment variables from .env file

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.get("/failure", (req, res) => {
    res.sendFile(__dirname + "/failure.html");
});

app.post("/", (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const apiKey = process.env.MAILCHIMP_APIKEY;
    const listId = process.env.MAILCHIMP_LIST;
    const serverPrefix = apiKey.split('-')[1]; // Extract server prefix from API key

    const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}`;

    const options = {
        method: "POST",
        auth: `gallo:${apiKey}` // Placeholder username. Can be any string.
    };

    const request = https.request(url, options, (response) => {
        let responseData = '';

        response.on("data", (chunk) => {
            responseData += chunk;
        });

        response.on("end", () => {
            if (response.statusCode === 200) {
                const mailchimpResponse = JSON.parse(responseData);
                if (mailchimpResponse.error_count > 0) {
                    const errorMessage = mailchimpResponse.errors[0].error;
                    console.log("Mailchimp API Error:", errorMessage);
                    res.redirect(`/failure?message=${encodeURIComponent(errorMessage)}`);
                } else {
                    res.sendFile(__dirname + "/success.html");
                }
            } else {
                let errorMessage = `Mailchimp API returned status code: ${response.statusCode}`;
                try {
                    const mailchimpError = JSON.parse(responseData);
                    if (mailchimpError.detail) {
                        errorMessage = mailchimpError.detail;
                    }
                } catch (e) {
                    // responseData might not be JSON
                }
                console.log(errorMessage);
                res.redirect(`/failure?message=${encodeURIComponent(errorMessage)}`);
            }
        });
    });

    request.on("error", (e) => {
        console.error(`Problem with request: ${e.message}`);
        res.sendFile(__dirname + "/failure.html");
    });

    request.write(jsonData);
    request.end();
});


app.listen(3000, () => {
    console.log("Listening on port 3000");
});






