/*
Pig Latin
*/

function processWord(word) {
  var vowels = "aeiouAEIOU";
  // starts with vowel
  if (vowels.indexOf(word[0]) !== -1) {
    return word + "way";
  }

  // find first vowel
  var firstVowel = -1;
  for (var i = 0; i < word.length; i++) {
    if (vowels.indexOf(word[i]) !== -1) {
      firstVowel = i;
      break;
    }
  }

  // is does not have a vowel
  if (firstVowel === -1) return word + "ay";

  // put from the first vowel to the end, then the previous characters and then 'ay'
  return word.slice(firstVowel) + word.slice(0, firstVowel) + "ay";
}
function igpayAtinlay(str) {
  var words = str.split(" ");
  var result = [];


  for (var i = 0; i < words.length; i++) {
    result.push(processWord(words[i]));
  }

  return result.join(" ");
}

// Examples
// console.log(igpayAtinlay("pizza"));      // "izzapay"
// console.log(igpayAtinlay("apple"));      // "appleway"
// console.log(igpayAtinlay("happy meal")); // "appyhay ealmay"
document.querySelector('#btn').addEventListener('click', () => {
  let str = document.querySelector('#txtVal').value
  document.querySelector('#pigLatLbl').innerText = igpayAtinlay(str)
})
