
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 3000
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname +'/index.html')
})

app.post('/calcular-bmi', (req, res) => {
  // get from form weight and height
  const weight = parseFloat(req.body.weight)
  const height = parseFloat(req.body.height)
  console.log(weight, height)
  const bmi =(weight / (height*height))*10000;
  res.send(`Tu BMI es: ${bmi.toFixed(2)}`)

})

app.listen(port, () => {
  console.log(`Exercise app listening on port ${port}`)
})
