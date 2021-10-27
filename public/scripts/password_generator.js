$(document).ready(function () {
  function generateLower() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  }
  function generateUpper() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
  }
  function generateNumber() {
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
  }
  function generateSymbol() {
    return String.fromCharCode(Math.floor(Math.random() * 14) + 33);
  }

  $("#password_gen").submit(function (event) {
    event.preventDefault();
    console.log($(this).find("#passwordLength").val());
    console.log($(this).find("#upperCaseBox").is(":checked"));
    console.log($(this).find("#lowerCaseBox").is(":checked"));
    console.log($(this).find("#numbersBox").is(":checked"));
    console.log($(this).find("#symbolsBox").is(":checked"));
  });
});
