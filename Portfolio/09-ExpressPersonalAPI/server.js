
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 3000
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('index', { names: persons_to_greet });
})


let persons_to_greet = []

let tasks = []

app.get('/greet', (req, res) => {
  const name = req.query.name;
  const new_elements = name.split(' ')
  persons_to_greet = [...persons_to_greet, ...new_elements];
  console.log('Greetings! ' + new_elements);
  res.render('index', { name: new_elements, names: persons_to_greet, to_index_link: true });
})

app.get('/wazzup', (req, res) => {
  const name = req.query.name;
  res.render('wazzup', { name });
})


app.post('/task', (req, res) => {
  const description = req.body.description;
  const priority = parseInt(req.body.priority)
  tasks = [...tasks, {description, priority}]
  console.log(description, priority)
  res.render('index', {tasks})

})


app.delete('/task', (req, res) => {
  tasks = tasks.filter((_, idx,_) => idx !== req.params.id);
  console.log(tasks)
  res.render('index', {tasks})
})

app.get('/task', (req, res) => {
  res.send(tasks)
})



app.listen(port, () => {
  console.log(`Exercise app listening on port ${port}`)
})

