/*
    Fibonacci Sequence - Enter a number and have the program
    generate the Fibonacci sequence to that number or to the Nth number.
*/
// like a cache for previously computed values
var memo = {};

function fibonacci() {
  "use strict";
  var n = document.getElementById("num").value;
  var val = f(n);
  return val;
}

function f(n) {
  var value;
  // Check if the memory array already contains the requested number
  if (memo.hasOwnProperty(n)) {
    value = memo[n];
  } else {
    if (n == 0 || n == 1) value = n;
    else value = f(n - 1) + f(n - 2);
    memo[n] = value;
  }

  return value;
}
// console.log(fibonacci(15));

document.querySelector('#btn').addEventListener('click', () => {
  let v = parseInt(document.querySelector('#num').value);
  document.querySelector('#fibonacciLbl').innerText = f(v);
})
