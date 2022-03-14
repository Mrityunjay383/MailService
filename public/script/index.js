function CopyMe(TextToCopy) {
  var TempText = document.createElement("input");
  TempText.value = TextToCopy;
  document.body.appendChild(TempText);
  TempText.select();

  document.execCommand("copy");
  document.body.removeChild(TempText);

  alert("Copied: " + TempText.value);
}


//Icon Animation
$('.aCon1').hover( () =>{
    $(".workI").addClass("iconA");
}, () => {
    $(".workI").removeClass("iconA");
});
