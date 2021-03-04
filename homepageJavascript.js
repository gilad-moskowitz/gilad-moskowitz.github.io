/** Setting the page theme and coloration **/
var currentTheme = "lightmode";
if (localStorage.myTheme != "dark"){
	localStorage.myTheme = "light";
	document.getElementById("darkModeSwitch").checked = false;
}

function toggleTheme(){
	if (localStorage.myTheme == "light"){
		currentTheme = "darkmode";
		localStorage.myTheme = "dark";
		document.body.classList.toggle("dark-theme");
		document.getElementById("darkModeSwitch").checked = true;
	}
	else {
		currentTheme = "lightmode";
		localStorage.myTheme = "light";
		document.body.classList.toggle("dark-theme");
		document.getElementById("darkModeSwitch").checked = false;
	}
}


function setTheme() {
	if(localStorage.myTheme == "light"){
		document.body.classList.toggle("dark-theme");
		document.getElementById("darkModeSwitch").checked = false;
	}
}