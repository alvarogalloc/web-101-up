// with modules
// import {randomSuperhero} from 'superheroes';
// import { randomSupervillain } from 'supervillains';
// import _ from 'lodash';


// without modules
const { randomSuperhero } = require('superheroes');
const { randomSupervillain } = require('supervillains');
const _ = require('lodash');


console.log('there is a battle between ' + randomSuperhero() + ' and ' + randomSupervillain());
console.log('the battle begins!');
let health_superhero = 100;
let health_supervillain = 100;

while (health_superhero > 0 && health_supervillain > 0) {
  let damage_to_superhero = _.random(5, 20);
  let damage_to_supervillain = _.random(5, 20);
  health_superhero -= damage_to_superhero;
  health_supervillain -= damage_to_supervillain;
  console.log(`superhero takes ${damage_to_superhero} damage, health is now ${_.max([health_superhero, 0])}`);
  console.log(`supervillain takes ${damage_to_supervillain} damage, health is now ${_.max([health_supervillain, 0])}`);
}
if (health_superhero <= 0 && health_supervillain <= 0) {
  console.log('both are defeated!');
} else if (health_superhero <= 0) {
  console.log('supervillain wins!');
} else {
  console.log('superhero wins!');
}

