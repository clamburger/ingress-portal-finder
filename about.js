document.getElementById('smallicon').onclick = function(){
  alert("Not this one you silly goose");
};

$("#version").html("v"+chrome.app.getDetails().version);