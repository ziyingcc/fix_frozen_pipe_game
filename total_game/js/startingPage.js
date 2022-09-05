// main page js code

function showDifficulty() {
	let choose = $("#startGame");
	choose.remove();
	let diffButtons = addDiff();
	$("body").append(diffButtons);
}

function addDiff() {
	return (
		"<div id='startGame'>" + 
		"<a href='gamerules.html'>" +
		"<button class='buttonStart'> Small Town </button>" + 
		"</a>" + 
		"<a href='gamerulesM.html'>" +
		"<button class='buttonStart'> Big City </button>" + 
		"</a>"
		)
}// main page js code

