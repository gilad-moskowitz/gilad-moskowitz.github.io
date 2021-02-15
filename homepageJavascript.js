var currentTheme = "darkmode";

function toggleTheme(){
	document.body.classList.toggle("dark-theme");
	if (currentTheme == "darkmode"){
		currentTheme = "lightmode";
	}
	else {
		currentTheme = "darkmode";
	}
}
