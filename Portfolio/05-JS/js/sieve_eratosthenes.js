/*
    Sieve of Eratosthenes - The sieve of Eratosthenes is one of the most efficient ways
    to find all of the smaller primes (below 10 million or so).
*/

//  we are going to set to false the ones that are not prime
var sieve = function(n) {
  "use strict";

  var i, j;
  var array = new Array(n + 1).fill(true);
  // 0 and 1 are not primes
  array[0] = array[1] = false;
  var primes = [];


  for (i = 2; i * i <= n; i++) {
    if (array[i]) {
      // remove all the multiples of our current number (that is prime)
      for (j = i * i; j <= n; j += i) {
        array[j] = false;
      }
    }
  }

  // this is not necessary is you just want a lookup table
  // like: is 2 prime? then sieve[2] should be true
  // our primes array just gives it in order
  for (i = 2; i <= n; i++) {
    if (array[i]) primes.push(i);
  }

  return primes;
};

// Example: print primes up to 1,000,000
// console.log(sieve(1000000));


document.querySelector('#btn').addEventListener('click', () => {
  let n =
    parseInt(document.querySelector('#num').value);

  document.querySelector('#primes').innerText = sieve(n);
})
