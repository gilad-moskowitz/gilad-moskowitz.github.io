var currentTheme = "darkmode";
if (localStorage.myTheme != "light"){
	localStorage.myTheme = "dark";
	document.getElementById("darkModeSwitch").checked = true;
}

function toggleTheme(){
	if (localStorage.myTheme == "dark"){
		currentTheme = "lightmode";
		localStorage.myTheme = "light";
		document.body.classList.toggle("dark-theme");
		document.getElementById("darkModeSwitch").checked = false;
	}
	else {
		currentTheme = "darkmode";
		localStorage.myTheme = "dark";
		document.body.classList.toggle("dark-theme");
		document.getElementById("darkModeSwitch").checked = true;
	}
}
