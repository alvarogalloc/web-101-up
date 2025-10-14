/*
    Prime Factorization - Have the user enter a number and find
    all Prime Factors (if there are any) and display them.
*/


// imma use the sieve
function sieve(n) {
  "use strict";
  if (!n)return [];

  var i, j;
  var primes = [];

  console.log(n)
  var array = new Array(n + 1).fill(true);
  array[0] = array[1] = false;

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


var getPrimeFactors = function(n) {
  "use strict";

  function isPrime(n) {
    var i;

    for (i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) {
        return false;
      }
    }
    return true;
  }

  var sequence = [];
  let ps = sieve(n);
  for (let p of ps) {
    if (n==1) break; // stop when we get 1
    // while its divisible
    while (n % p === 0) {
      n = n / p;
      sequence.push(p)
    }
  }
  return sequence;
};

// the prime factors for this number are: [ 2, 3, 5, 7, 11, 13 ]
console.log(getPrimeFactors(30030));
document.querySelector('#btn').addEventListener('click', () => {
  let n =
    parseInt(document.querySelector('#num').value);

  document.querySelector('#pf').innerText = `${n} = ${getPrimeFactors(n).join('x')}`;
})
