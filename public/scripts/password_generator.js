$(document).ready(function() {
  const charCodeRange = function(startRange, endRange) {
    let range = [];
    for (let i = startRange; i < endRange; i++) {
      range.push(i);
    }
    return range;
  };

  let lowerCase = charCodeRange(97, 122);
  let upperCase = charCodeRange(65, 90);
  let numberCase = charCodeRange(48, 57);
  let symbolCase = charCodeRange(33, 47);

  $("#password_gen").submit(function(event) {
    event.preventDefault();
    let passwordLength = $(this).find("#passwordLength").val();
    let upper = $(this).find("#upperCaseBox").is(":checked");
    let lower = $(this).find("#lowerCaseBox").is(":checked");
    let number = $(this).find("#numbersBox").is(":checked");
    let symbol = $(this).find("#symbolsBox").is(":checked");

    $('input[name="generated_password"').empty;
    let charCodeArr = [];
    if (upper) {
      charCodeArr.push(upperCase);
    }
    if (lower) {
      charCodeArr.push(lowerCase);
    }
    if (number) {
      charCodeArr.push(numberCase);
    }
    if (symbol) {
      charCodeArr.push(symbolCase);
    }
    const flatCharCodeArr = charCodeArr.flat();
    let password = [];
    for (let i = 0; i < passwordLength; i++) {
      password.push(
        String.fromCharCode(
          flatCharCodeArr[Math.floor(Math.random() * flatCharCodeArr.length)]
        )
      );
    }
    $('input[name="generated_password"').val(
      `${password.join("")}`
    );
  });
});
