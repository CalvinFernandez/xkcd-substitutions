// var saved = true;
var next = 1;

function makeDirty() {
  $("#save").removeClass("btn-success").addClass("btn-warning").children("i").removeClass("fa-check").addClass("fa-save");
  $("#save span").text(" Click to Save");
  // saved = false;
}

function makeClean() {
  $("#save").removeClass("btn-warning").addClass("btn-success").children("i").removeClass("fa-save").addClass("fa-check");
  $("#save span").text("Saved");
  // saved = true;
}

function saveOptions(e) {
  e.preventDefault;
  var blacklist = $("#website-blacklist").val().replace(/\s+/g, "").toLowerCase().split(",");
  var replacements = [];
  var originals = $('#replacements [name="origin"]');
  var remoteUrl = $("#remoteUrl").val();
  var replaces = $('#replacements [name="replace"]');
  for (var i = ((Math.max(originals.length, replaces.length)) - 1); i >= 0; i--) {
    var org = originals[i].value.toLowerCase()
    var rep = replaces[i].value.toLowerCase()
    if (org === "" && rep === "") {
      continue;
    }
    replacements.push([org, rep]);
  };
  chrome.storage.sync.set({
      "remoteUrl": remoteUrl,
      "blacklist": blacklist,
      "replacements": replacements
    },
    function() {
      makeClean();
    }
  );
}

function reset(){
    chrome.storage.sync.set({
      "blacklist": default_blacklisted_sites,
      "replacements": default_replacements
    },
    function() {
      makeClean();
      populateSettings();
    }
  );
}

function populateSettings() {
  $("#replacements").empty();
  $("blacklist input").val("");
  chrome.storage.sync.get(null, function(result) {
      $("#remoteUrl").val(result["remoteUrl"]);
    $("#blacklist input").val(result["blacklist"].join(", "));
    var replacements = result['replacements'];
    for (var i = 0; i < replacements.length; i++) {
      addbutt(null, replacements[i][0], replacements[i][1]);
    };
    addbutt();
  });
  makeClean();
}

function addbutt(e, original, replacement) {
  original = original || "";
  replacement = replacement || "";
  if (e) {
    e.preventDefault();
  }
  var newIn = '<div class="row ginp"><div class="col-xs-6"> <pre>' + original + '</pre></div><div class="col-xs-6"><pre>' + replacement + '</pre></div></div>'

  $("#replacements").prepend(newIn);
}

$(document).ready(function() {
  $(".add-more").on('click', addbutt);

  $("#save").on('click', saveOptions);

  $("#refresh").on('click', populateSettings);

  $("#reset").on('click', reset)

  $("#blacklist").keypress(function(e) {
    if (e.which == 13) {
      e.preventDefault();
      save_options(e);
    }
  });

  $("#remoteUrl").keypress(function(e) {
    if (e.which == 13) {
        e.preventDefault();
        save_options();
    }
  });

  $("#options").on('input', saveOptions);

  $("#replacements").keypress(function(e) {
    if (e.which == 13) {
      e.preventDefault();
      addbutt(e);
      $(this).find('input')[0].focus();
    }
  });

  populateSettings();
});
