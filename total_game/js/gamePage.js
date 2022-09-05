// game page js code
let pipeIdx = 1;
let existAP = false;
let haveCurrAct = false;
let currActTime = 0;
let actionPanelOpen = false;
let leaking_frequency = 5000;
let leakIntervalHandle;
let soundOn = true;
var state = [];
var turn = 0;
var salary = 10;
var leaking = 0.25;
var button_left = 0;
for (var n = 0; n < 6; ++n) {
  state[n] = 0;
}

var replaceau = new Audio("audio/replace.mp3");
var meltau = new Audio("audio/melt.mp3");
var coverau = new Audio("audio/coat.mp3");
//
//the main idea for checking states is do a check every 5 seconds
//the state array will store states for all pipes based on their index
//pipe1 with state[0], and pipe2 with state[1]...
//there are 5 possible value for the state, 0 for normal, 1 for leaking
//2 for small ice, 3 for large ice and 5 for totally broken
//a normal pipe will have 40% to be leaking and a borken pipe, after every 5 seconds, will go to the next state
//
//some possible idea is that if you want to implement the solver, you can add more possible values in the array
//and thus the checkleaking function will not do anything to the pipes in the process

// Main
$(document).ready(function () {
  console.log("Ready!");

  $(".btn-primary").click(function () {
    leaking_frequency -= 1000;
    if (leaking_frequency > 800 && leaking_frequency < 9000) {
      clearInterval(leakIntervalHandle);
      leakIntervalHandle = setInterval(checkleaking, leaking_frequency);
      $(".btn-warning").removeClass("disabled");
    } else {
      leaking_frequency += 1000;
      $(this).addClass("disabled");
    }
    $("#leakingFreq").html(leaking_frequency / 1000);
  });
  $(".btn-warning").click(function () {
    leaking_frequency += 1000;
    if (leaking_frequency > 800 && leaking_frequency < 9000) {
      clearInterval(leakIntervalHandle);
      leakIntervalHandle = setInterval(checkleaking, leaking_frequency);
      $(".btn-primary").removeClass("disabled");
    } else {
      leaking_frequency -= 1000;
      $(this).addClass("disabled");
    }
    $("#leakingFreq").html(leaking_frequency / 1000);
  });
  setInterval(function () {
    checkleaking();
  }, leaking_frequency);

  $("#soundBtn").click(function () {
    if (soundOn) {
      soundOn = false;
      $("#soundBtn").html("Turn on sound effects");
    } else {
      soundOn = true;
      $("#soundBtn").html("Turn off sound effects");
    }
  });
});

function createItemDivString(itemIndex, type, imageString) {
  if (type === "burstpipe") {
    return (
      "<img src='asset/" +
      imageString +
      "'id='" +
      type +
      itemIndex +
      "'class='pipe0'" +
      "alt='horizontal pipe'" +
      "onClick='gameAction(this.id)'/>"
    );
  } else {
    return (
      "<img src='asset/pipe-state/" +
      imageString +
      "'id='" +
      type +
      itemIndex +
      "'class='pipe0'" +
      "alt='horizontal pipe'" +
      "onClick='gameAction(this.id)'/>"
    );
  }
}

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function checkleaking() {
  // if (parseInt($("#money").html()) <= 0) {
  //   window.location.href = "gameover.html";
  // }
  let val1 = parseInt($("#money").html());
  val1 += salary;
  $("#money").html(val1);
  if (turn == 12 || turn == 24) {
    leaking += 0.1;
    salary += 5;
    $("#salary").html(salary);
  }

  if (turn == 30) {
    window.location.href = "gamesucceed.html";
  }
  turn += 1;
  $("#round").html(30 - turn);
  for (var idx = 1; idx < 7; idx++) {
    var change = false;
    var left = [83, 172, 262, 352, 444, 532];
    if (state[idx - 1] == 0 && change == false) {
      let p = getRandomNumber(0, 1);
      change = true;
      if (p < leaking) {
        state[idx - 1] = 1;
        var img = createItemDivString(idx, "leak", "drip.png");
        // console.log(img);

        // alert(img);
        $("body").append(img);
        let leak = $("#leak" + idx);
        let tube = $("#pipe" + idx);

        leak.css("position", "absolute");
        leak.css("height", 90);
        left_pos = parseInt(tube.css("left")) + 60;
        leak.css("left", left_pos);
        top_pos = 360;
        // console.log(top_pos);
        leak.css("top", top_pos);

        button_left = left_pos;
        leak.css("z-index", 99);

        document.getElementById("pipe" + idx + "_status").innerHTML =
          "Pipe" + idx + "'s status: Leaking";
        // leak.css("top", parseInt(tube.css("top")));
        if (actionPanelOpen) {
          let actionPanel = $("#actionPanel");
          actionPanel.remove();
          actionPanelOpen = false;
        }
      }
    }
    if (state[idx - 1] == 1 && change == false) {
      change = true;
      state[idx - 1] = 2;
      var img = createItemDivString(idx, "smallice", "sm-ice.png");
      $("body").append(img);
      let ice = $("#smallice" + idx);
      let leak = $("#leak" + idx);

      ice.css("position", "absolute");
      left_pos = parseInt(leak.css("left"));
      ice.css("left", left_pos);
      ice.css("top", 350);

      ice.css("height", 85);
      ice.css("z-index", 90);
      document.getElementById("pipe" + idx + "_status").innerHTML =
        "Pipe" + idx + "'s status: Small ice";
      leak.remove();
      // console.log("#smallice" + idx)
      if (actionPanelOpen) {
        let actionPanel = $("#actionPanel");
        actionPanel.remove();
        actionPanelOpen = false;
      }
    }
    if (state[idx - 1] == 2 && change == false) {
      change = true;
      state[idx - 1] = 3;
      var img = createItemDivString(idx, "bigice", "lg-ice.png");
      $("body").append(img);
      let ice = $("#bigice" + idx);
      let smice = $("#smallice" + idx);
      ice.css("position", "absolute");
      // left_pos = .css("left")) + 60
      ice.css("left", parseInt(smice.css("left")));
      ice.css("top", 360);
      ice.css("height", 73);
      ice.css("z-index", 90);
      document.getElementById("pipe" + idx + "_status").innerHTML =
        "Pipe" + idx + "'s status: Big ice";
      smice.remove();
      if (actionPanelOpen) {
        let actionPanel = $("#actionPanel");
        actionPanel.remove();
        actionPanelOpen = false;
      }
    }

    if (state[idx - 1] == 3 && change == false) {
      change = true;
      state[idx - 1] = 5;
      let oldpipe = $("#pipe" + idx);
      let ice = $("#bigice" + idx);
      // oldpipe.css("position", "absolute");
      // ice.css("position", "absolute");
      console.log(oldpipe);
      console.log(idx);
      left_pos = parseInt(oldpipe.css("left"));
      // console.log(left_pos);
      ice.remove();
      oldpipe.attr("src", "asset/brust.png");
      // var img = createItemDivString(idx, "burstpipe", "brust.png");
      // $("body").append(img);

      // let newpipe = $("#burstpipe" + idx);
      // newpipe.css("position", "absolute");

      // // newpipe.css("left", left_pos);
      // // console.log(left_pos);
      // newpipe.css("top",350);

      // newpipe.css("left", idx * 120 -40);
      // newpipe.css("z-index", 60);
      document.getElementById("pipe" + idx + "_status").innerHTML =
        "Pipe" + idx + "'s status: Bursted";
    }

    if (state[idx - 1] == 4 && change == false) {
      let undoCoat = Math.random();
      if (undoCoat > 0.75) {
        change = true;
        state[idx - 1] = 0;
        let coat = $("#coat" + idx);
        coat.remove();
        if (actionPanelOpen) {
          let actionPanel = $("#actionPanel");
          actionPanel.remove();
          actionPanelOpen = false;
        }
      }
    }
    if (state[idx - 1] == 5 && change == false) {
      window.location.href = "gameover.html";
    }
  }
}
function createActionPanel(type, actID) {
  if (type == "l") {
    return (
      "<div id='actionPanel'> <button id='" +
      actID +
      "'class='action1 btn btn-info btn-sm' onClick='actionReplace(this.id)'> replace </button>" +
      " <button id='" +
      actID +
      "'class='action1 btn btn-warning btn-sm'' onClick='actionCover(this.id)'> cover </button></div>"
    );
  } else if (type == "s") {
    return (
      "<div id='actionPanel'> <button id='" +
      actID +
      "'class='action1 btn btn-info btn-sm' onClick='actionReplace(this.id)'> replace </button>" +
      " <button id='" +
      actID +
      "'class='action1 btn btn-warning btn-sm'' onClick='actionMelt(this.id)'> melt </button></div>"
    );
  }
  if (type == "b") {
    return (
      "<div id='actionPanel'> <button id='" +
      actID +
      "'class='action1 btn btn-info btn-sm' onClick='actionReplace(this.id)'> replace </button>" +
      " <button id='" +
      actID +
      "'class='action1 btn btn-warning btn-sm'' onClick='actionMelt(this.id)'> melt </button></div>"
    );
  }
}

function gameAction(actionID) {
  // if
  if (parseInt($("#money").html()) >= 5) {
    actionPanelOpen = true;
    if (existAP == false) {
      existAP = true;
    } else {
      let prevAP = $("#actionPanel");
      prevAP.remove();
      // console.log("removed");
    }
    let type = actionID.charAt(0);
    let idx = parseInt(actionID.charAt(actionID.length - 1));
    // console.log(idx)
    // console.log(type);

    let ap = createActionPanel(type, actionID);
    $("body").append(ap);
    button_left = $("#" + actionID).offset().left;
    $("#actionPanel").css("left", button_left);
    $("#actionPanel").css("top", 280);
  }
}

function actionReplace(actionID) {
  let actionPanel = $("#actionPanel");
  actionPanel.remove();
  actionPanelOpen = false;
  if (soundOn) {
    replaceau.play();
    console.log("playing sound");
  }

  let idx = actionID.charAt(actionID.length - 1);
  let type = actionID.charAt(0);
  var left = [83, 172, 262, 352, 444, 532];
  let currState = $("#" + actionID);
  // console.log()
  //
  // add curr action thing here
  currState.remove();
  let val1 = parseInt($("#money").html());
  val1 -= 20;
  $("#money").html(val1);
  console.log("fixed");
  state[idx - 1] = 0;
  document.getElementById("pipe" + idx + "_status").innerHTML =
    "Pipe" + idx + "'s status: Normal";
}

function addCover(type, itemIndex) {
  return (
    "<img src='asset/pipe-state/coat.png" +
    "'id='" +
    type +
    itemIndex +
    "'class='pipe0'" +
    "alt='horizontal pipe'" +
    "onClick='gameAction(this.id)'/>"
  );
}

function actionCover(actionID) {
  let val1 = parseInt($("#money").html());
  val1 -= 10;
  $("#money").html(val1);
  if (soundOn) {
    coverau.play();
  }

  let actionPanel = $("#actionPanel");
  actionPanel.remove();
  actionPanelOpen = false;
  var left = [83, 172, 262, 352, 444, 532];
  let idx = parseInt(actionID.charAt(actionID.length - 1));
  let type = "coat";
  let currState = $("#" + actionID);
  // currState.remove();
  let cov = addCover(type, idx);
  $("body").append(cov);
  let cover = $("#coat" + idx);
  cover.css("position", "absolute");
  cover.css("left", parseInt(currState.css("left")));
  cover.css("top", 350);
  cover.css("height", 85);
  cover.css("z-index", 80);
  currState.remove();
  state[idx - 1] = 4;
  document.getElementById("pipe" + idx + "_status").innerHTML =
    "Pipe" + idx + "'s status: Normal";
}

function actionMelt(actionID) {
  if (soundOn) {
    meltau.play();
  }
  let val1 = parseInt($("#money").html());
  val1 -= 5;
  $("#money").html(val1);
  let actionPanel = $("#actionPanel");
  actionPanel.remove();
  actionPanelOpen = false;
  var left = [83, 172, 262, 352, 444, 532];
  let idx = parseInt(actionID.charAt(actionID.length - 1));
  if (state[idx - 1] == 2) {
    state[idx - 1] = 1;
    var img = createItemDivString(idx, "leak", "drip.png");
    $("body").append(img);
    let ice = $("#smallice" + idx);
    let leak = $("#leak" + idx);
    leak.css("position", "absolute");
    leak.css("left", parseInt(ice.css("left")));
    leak.css("top", 358);
    leak.css("height", 90);
    leak.css("z-index", 80);
    ice.remove();
    document.getElementById("pipe" + idx + "_status").innerHTML =
      "Pipe" + idx + "'s status: Leaking";
    // console.log("#smallice" + idx)
    // console.log(leak)
  }
  if (state[idx - 1] == 3) {
    state[idx - 1] = 2;
    var img = createItemDivString(idx, "smallice", "sm-ice.png");
    $("body").append(img);
    let ice = $("#smallice" + idx);
    let bigice = $("#bigice" + idx);
    ice.css("position", "absolute");
    ice.css("left", parseInt(bigice.css("left")));
    ice.css("top", 350);
    ice.css("height", 85);
    ice.css("z-index", 80);
    bigice.remove();
    document.getElementById("pipe" + idx + "_status").innerHTML =
      "Pipe" + idx + "'s status: Small ice";
  }
}


