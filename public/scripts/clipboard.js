$(document).ready(function () {
  function copyToClipboard(text) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
  }

  $("#copyButton").click(function () {
    copyToClipboard($('input[name="manual_password"]').val());
  });

  $("#copyButtonAcc").click(function () {
    copyToClipboard($(".password").text().trim());
  });
});
