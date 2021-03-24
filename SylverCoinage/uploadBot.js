/** Initializing Page Parameters **/
var currentTurn = -1;
var movesPlayed = [];
var gamesCounter = 0;
var p1Wins = 0;
var p2Wins = 0;
var p1Penalties = 0;
var p2Penalties = 0;
var remainingGaps = [];
var currentGCD = -1;
var playingBot = false;
var playingHuman = false;
var relations = [];
var uploadedFunction = "";




/** Math functions **/
function PrimeFactorization(n){
    let i = 2;
    let factors = [];
    while (i*i <= n){
        if ((n % i) != 0)
            i += 1;
        else {
            n = n/i;
            factors.push(i);
        }
    }
    if (n > 1)
        factors.push(n);
    return factors;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function sum(array){
    sumTotal = 0;
    for(let i = 0; i < array.length; i++){
        sumTotal += array[i];
    }
    return sumTotal;
}

function gcd(a, b) {
    if (a == 0)
        return b;
    return gcd(b % a, a);
}

function gcd_list(list){
    if(list.length == 0)
        return -1;
    if(list.length == 1)
        return list[0];
    let totalGCD = gcd(list[0], list[1]);
    for(let i = 2; i < list.length; i++){
        totalGCD = gcd(totalGCD, list[i]);
        if (totalGCD == 1)
            return totalGCD;
    }
    return totalGCD;
}

/** Semigroup functions **/
function SetAdd(L1, L2){
    let L3 = [];
    for(let a = 0; a < L1.length; a++){
        for(let b = 0; b < L2.length; b++){
            L3.push(parseInt(L1[a]) + parseInt(L2[b]));
        }
    }
    let setList = new Set(L3);
    let List = [...setList].sort(function(a, b) { return a - b; });
    return List;
}

function ListByGensUpToE(gens){
    let currentCount = 0;
	let previousCount = 0;
	let newGennies = [];
    for (let t = 0; t < gens.length; t++){
        let isGen = true;
        for(let y = 0; y < gens.length; y++){
            if(gens[y] == gens[t])
                continue;
            if(parseInt(gens[t])%parseInt(gens[y]) == 0){
                isGen = false;
                break;
            }
        }
        if(isGen)
            newGennies.push(parseInt(gens[t]));
    }
    if(newGennies.length < 2 || gcd_list(newGennies) != 1)
        return 0;
    let E = 3*Math.max(...newGennies)*Math.min(...newGennies);
    let Frob = Math.max(...newGennies)*Math.min(...newGennies)
    let listOfElements = [...newGennies];
    let elementz = [];
    let weStillHaveTime = true;
    while (weStillHaveTime){
        for (let a = 0; a < listOfElements.length; a++){
            elementz.push(parseInt(listOfElements[a]));
        }
        listOfElements = SetAdd(listOfElements, newGennies);
        let setList = new Set(elementz);
        elementz = [...setList].sort(function(a, b) { return a - b; });
		if(elementz.includes(Frob)){
			for(let r = 0; r < elementz.length; r++){
				currentCount += 1;
				if(elementz[r] >= Frob)
					break;
			}
			if(currentCount == previousCount)
				weStillHaveTime = false;
			else{
				previousCount = parseInt(currentCount);
				currentCount = 0;
			}
		}
    }
    let finalList = [];
    for (let i = 0; i < elementz.length; i++){
        if(elementz[i] > Frob)
            break;
        finalList.push(elementz[i]);
    }
    return finalList;
}

function gaps(Semigroup){
    let gapList = [];
    for (let j = 1; j < Math.max(...Semigroup); j++){
        if (!Semigroup.includes(j)){
            gapList.push(j);
        }
    }
    return gapList;
}

/** Getting the move from the user (input) **/
function getMove(){
    let getNewMove = document.getElementById("move").value;
    document.getElementById("move").value = "";
	if (getNewMove == "")
		return 0;
    return getNewMove;
}

/** Checking the legality of a given move **/
function legalMove(thisMove){
    if (parseInt(thisMove) < 1)
        return false;
    if (thisMove == "")
        return false;
	if(movesPlayed.includes(thisMove))
		return false;
    if(movesPlayed.length == 0)
        return true;
    if(currentGCD == -1)
        currentGCD = gcd_list(movesPlayed);
    if(currentGCD == 1){
        let thisSemigroup = ListByGensUpToE(movesPlayed);
        let thisGaps = gaps(thisSemigroup);
        if (thisGaps.includes(thisMove))
            return true;
        else
            return false;
    }
    else{
        if(gcd(thisMove, currentGCD) == currentGCD){
            let newGens = [];
            for (let i = 0; i < movesPlayed.length; i++){
                newGens.push(parseInt(movesPlayed[i]/currentGCD));
            }
            let newSemigroup = ListByGensUpToE(newGens);
            let newGaps = gaps(newSemigroup);
            let moveOverGCD = thisMove/currentGCD;
            if (newGaps.includes(parseInt(moveOverGCD)))
                return true;
            else
                return false;
        }
        else
            return true
    }
}

/** Checking if the game is over **/
function gameNotComplete(list){
    if (list.includes(1))
        return false;
    else
        return true;
}

/** Code for bot **/
function alwaysOddBot(){
    if (movesPlayed.length == 0){
        let possibility = getRandomInt(1, 7);
		let primes = [5, 5, 7, 11, 13, 17, 19, 23];
		return primes[possibility];
    }
    else if (movesPlayed.includes(3) && !movesPlayed.includes(2)){
        return 2;
    }
    else if (movesPlayed.includes(2) && !movesPlayed.includes(3)){
        return 3;
    }
    else if (movesPlayed.includes(2) && movesPlayed.includes(3)){
        return parseInt(1);
    }
    if ((currentGCD > 1) && (movesPlayed.length == 1)){
        let factor = PrimeFactorization(parseInt(movesPlayed[0]))
        if ((factor.length == 1) && (parseInt(movesPlayed[0]) > 10))
            return 9;
        else if (factor.length == 1)
            return (parseInt(movesPlayed[0]) + 1);
        else{
            for(let e = 0; e < factor.length; e++){
                if(parseInt(factor[e]) > 3)
                    return parseInt(factor[e]);
            }
            if(parseInt(movesPlayed[0]) > 16)
                return 16;
            else
                return (parseInt(movesPlayed[0]) + 1);
        }
    }
    else if ((currentGCD > 1))
        return (Math.min(...movesPlayed) + 1);
    if ((currentGCD == 1) && (remainingGaps.length == 0)){
        remainingGaps = gaps(ListByGensUpToE(movesPlayed));
    }
    if (remainingGaps.length > 1){
        if(remainingGaps.length%2 == 0)
            return Math.max(...remainingGaps);
        let thisValue = remainingGaps.length - 1;
        let linearCombis = [];
        for (let i = 0; i < Math.max(...remainingGaps); i++){
            if (!remainingGaps.includes(i))
                linearCombis.push(i);
        }
        while(thisValue > 0){
            let pretendMove = remainingGaps[thisValue];
            if (pretendMove < 4)
                return Math.max(...remainingGaps);
            let positionForOpponent = [];
            for(let x = 0; x < remainingGaps.length; x++){
                let x_stays = true;
                for(let y = 0; y < linearCombis.length; y++){
                    if(((remainingGaps[x] - linearCombis[y]) >= 0) && ((remainingGaps[x] - linearCombis[y])%pretendMove == 0)){
                        x_stays = false;
                        break;
                    }
                }
                if(x_stays)
                    positionForOpponent.push(remainingGaps[x]);
            }
            if(positionForOpponent.length%2 != 0)
                return pretendMove;
            else
                thisValue--;
        }
        return Math.max(...remainingGaps);
    }
    else
        return parseInt(1);
}

function playBotMove(bot){
    if((currentTurn == 1) && (document.getElementById("currentTurn").innerHTML != "Game Over")) {
        let botMove = bot;
        if (remainingGaps.length == 0) {
            if (legalMove(botMove)) {
                movesPlayed.push(botMove);
                checkGameState();
            } else {
                penaltyForPlayer();
            }
        } else {
            let including = false;
            for (let q = 0; q < remainingGaps.length; q++) {
                if (parseInt(botMove) == parseInt(remainingGaps[q])) {
                    including = true;
                    break;
                }
            }
            if (including) {
                let linearCombos = [];
                for (let j = 0; j < Math.max(...remainingGaps); j++) {
                    if (!remainingGaps.includes(j))
                        linearCombos.push(j);
                }
                let newGappies = [];
                for (let x = 0; x < remainingGaps.length; x++) {
                    let x_stays = true;
                    for (let y = 0; y < linearCombos.length; y++) {
                        if (((remainingGaps[x] - linearCombos[y]) >= 0) && ((remainingGaps[x] - linearCombos[y]) % botMove == 0)) {
                            x_stays = false;
                            break;
                        }
                    }
                    if (x_stays)
                        newGappies.push(remainingGaps[x]);
                }
                remainingGaps = [...newGappies];
                movesPlayed.push(botMove);
                checkGameState();
            } else {
                penaltyForPlayer()
            }
        }
    }
}

/** Game State Checking Function **/
function checkGameState(){
	document.getElementById("remainingMoves").innerHTML = "The remaining legal moves are: ";
    document.getElementById("movesAlready").innerHTML = movesPlayed.join(', ');
    currentTurn = Math.pow(-1, movesPlayed.length + gamesCounter + 1);
    if(currentGCD != 1)
        currentGCD = gcd_list(movesPlayed);
    document.getElementById("gameNumber").innerHTML = "Game " + (gamesCounter + 1);
    if(gameNotComplete(movesPlayed)){
        if(currentGCD != 1)
            document.getElementById("movesLeft").innerHTML = "There are an infinite number of moves left";
        else if(remainingGaps.length == 0){
            remainingGaps = gaps(ListByGensUpToE(movesPlayed));
			if(remainingGaps.length > 500)
				document.getElementById("movesLeft").innerHTML = remainingGaps.join(', ');
			else{
				document.getElementById("movesLeft").innerHTML = "";
				var doingIt = addTable();
			}
        }
        else{
            if(remainingGaps.length > 500)
				document.getElementById("movesLeft").innerHTML = remainingGaps.join(', ');
			else{
				document.getElementById("movesLeft").innerHTML = "";
				var doingIt = addTable();
			}
        }
        if (currentTurn == -1)
            document.getElementById("currentTurn").innerHTML = "Current Turn: Player 1";
        else
            document.getElementById("currentTurn").innerHTML = "Current Turn: Player 2";
    }
    else {
		document.getElementById("myDynamicTable").innerHTML = "";
        document.getElementById("movesLeft").innerHTML = remainingGaps.join(', ');
        if (currentTurn == -1){
            p1Wins += 1;
			document.getElementById("remainingMoves").innerHTML = "There are no remaining legal moves";
            document.getElementById("currentTurn").innerHTML = "Game Over";
            document.getElementById("GameOver").innerHTML = "Player 1 wins " + "Current Score: " + [p1Wins, p2Wins];
			document.getElementById("gameButton").style.display = 'none';
        }
        else {
            p2Wins += 1;
			document.getElementById("remainingMoves").innerHTML = "There are no remaining legal moves";
            document.getElementById("currentTurn").innerHTML = "Game Over";
            document.getElementById("GameOver").innerHTML = "Player 2 wins " + "Current Score: " + [p1Wins, p2Wins];
			document.getElementById("gameButton").style.display = 'none';
        }
    }
	if(remainingGaps.length > 0){
		lineCombo = []
		for (i = 0; i < Math.max(...remainingGaps); i++){
			if(!remainingGaps.includes(i))
				lineCombo.push(i);
		}
		relations = coverRelations(remainingGaps, lineCombo);
	}
    return [p1Wins, p2Wins];
}

/** penalties function **/
function penaltyForPlayer(){
    if(currentTurn == -1){
        p1Penalties += 1;
        if(p1Penalties >= 3){
            document.getElementById("penalties").innerHTML = "Player 1 has too many penalties, you lose";
			p1Penalties = 0;
            movesPlayed.push(1);
        }
        else{
            document.getElementById("penalties").innerHTML = "P1 has " + p1Penalties + " penalties, and P2 has " + p2Penalties + " penalties";
        }
    }
    else{
        p2Penalties += 1;
        if(p2Penalties >= 3){
			p2Penalties = 0;
            document.getElementById("penalties").innerHTML = "P2 has too many penalties, you lose";
            movesPlayed.push(1);
        }
        else{
            document.getElementById("penalties").innerHTML = "P1 has " + p1Penalties + " penalties, and P2 has " + p2Penalties + " penalties";
        }
    }
	checkGameState();
}

/** Code for playing **/
function playMoveVSBot(){
    let newlyPlayed = parseInt(getMove());
    if (remainingGaps.length == 0){
        if (legalMove(newlyPlayed)){
            movesPlayed.push(newlyPlayed);
            checkGameState();
        }
        else{
            penaltyForPlayer();
        }
    }
    else{
        let including = false;
        for(let q = 0; q < remainingGaps.length; q++){
            if(parseInt(newlyPlayed) == parseInt(remainingGaps[q])){
                including = true;
                break;
            }
        }
        if(including){
            let linearCombos = [];
            for (let j = 0; j < Math.max(...remainingGaps); j++){
                if(!remainingGaps.includes(j))
                    linearCombos.push(j);
            }
            let newGappies = [];
            for(let x = 0; x < remainingGaps.length; x++){
                let x_stays = true;
                for(let y = 0; y < linearCombos.length; y++){
                    if(((remainingGaps[x] - linearCombos[y]) >= 0) && ((remainingGaps[x] - linearCombos[y])%newlyPlayed == 0)){
                        x_stays = false;
                        break;
                    }
                }
                if(x_stays)
                    newGappies.push(remainingGaps[x]);
            }
            remainingGaps = [...newGappies];
            movesPlayed.push(newlyPlayed);
            checkGameState();
        }
        else{
            penaltyForPlayer()
        }
    }
    playBotMove(alwaysOddBot());
}


/* CODE FOR USER UPLOAD */
var __count = 0;
const __detectInfiniteLoop = () => {
	if(__count > 10000000) {
		throw new Error('Infinite Loop detected');
	}
	__count += 1;
}

function parseScriptAndFix(theScript) {
	let newString = theScript;
	let position = 0;
	let stillGoing = true;
	let stillGoing2 = true;
	let theFirstFunction = newString.indexOf("myNewBot");
	let theFirstInsert = newString.indexOf("{", theFirstFunction);
	newString = newString.substr(0, theFirstInsert) + "{__count = 0;" + newString.substr(theFirstInsert + 1);
	var replacement = "{__detectInfiniteLoop();"
	while(stillGoing){
		let whilePosition = newString.indexOf("while", position);
		if(whilePosition == -1){
			stillGoing = false;
			break;
		}
		let breakPoint = newString.indexOf("{", whilePosition);
		if(breakPoint == -1){
			stillGoing = false;
			break;
		}
		newString = newString.substr(0, breakPoint) + replacement + newString.substr(breakPoint + 1); 
		position = newString.indexOf("while", position) + 1;
	}
	position = 0;
	while(stillGoing2){
		let forPosition = newString.indexOf("for", position);
		if(forPosition == -1){
			stillGoing2 = false;
			break;
		}
		let breakPoint = newString.indexOf("{", forPosition);
		if(breakPoint == -1){
			stillGoing2 = false;
			break;
		}
		newString = newString.substr(0, breakPoint) + replacement + newString.substr(breakPoint + 1); 
		position = newString.indexOf("for", position) + 1;
	}
	return newString;
}

function uploadFunc(){
	document.getElementById("accepted").innerHTML = "";
	document.getElementById("errorLog").innerHTML = "";
	var functionalBot = true;
	var temp = document.getElementById("uploadFunction").value
	var updatedTemp = parseScriptAndFix(temp);
    var newFunction = "<script>" + updatedTemp + "</script>";
    var placehold = document.getElementById("placeHolder");
    placehold.innerHTML = newFunction;
    var oldScript = placehold.querySelector('script');
    var newScript = document.createElement('script');
    newScript.textContent = oldScript.textContent;
    var attrs = oldScript.attributes;
    for(var j=0;j<attrs.length;j++){
        newScript.setAttribute(attrs[j],oldScript.getAttribute(attrs[j]));
    }
    oldScript.parentNode.replaceChild(newScript,oldScript);
	//Setting up the bot testing protocol
	let movesTrial = movesPlayed;
	let gapsTrial = remainingGaps;
	try {
		myNewBot(movesTrial, gapsTrial);
	} catch(err) {
		document.getElementById("errorLog").innerHTML = '<br>' + '<br>' + "Error log: " + '<br>';
		document.getElementById("errorLog").innerHTML += err.message + '<br>';
		console.clear();
		__count = 0;
		functionalBot = false;
	}
	try {
		movesTrial = [];
		gapsTrial = [];
		let theNewMove = myNewBot(movesTrial, gapsTrial);
		if(theNewMove > 30 || theNewMove < 1)
			throw new Error("Your bot doesn't follow the rules for the first move");
	} catch(err) {
		document.getElementById("errorLog").innerHTML = '<br>' + '<br>' + "Error log: " + '<br>';
		document.getElementById("errorLog").innerHTML += err.message + '<br>';
		console.clear();
		__count = 0;
		functionalBot = false;
	}
	try {
		movesTrial = [4, 6];
		gapsTrial = [];
		let theNewMove = myNewBot(movesTrial, gapsTrial);
		if(theNewMove > 100 || theNewMove < 1)
			throw new Error("Your bot doesn't follow the rules for an infinite position");
	} catch(err) {
		document.getElementById("errorLog").innerHTML = '<br>' + '<br>' + "Error log: " + '<br>';
		document.getElementById("errorLog").innerHTML += err.message + '<br>';
		console.clear();
		__count = 0;
		functionalBot = false;
	}
	try {
		movesTrial = [6, 9, 12];
		gapsTrial = [];
		let theNewMove = myNewBot(movesTrial, gapsTrial);
		if(theNewMove > 100 || theNewMove < 1)
			throw new Error("Your bot doesn't follow the rules for an infinite position");
	} catch(err) {
		document.getElementById("errorLog").innerHTML = '<br>' + '<br>' + "Error log: " + '<br>';
		document.getElementById("errorLog").innerHTML += err.message + '<br>';
		console.clear();
		__count = 0;
		functionalBot = false;
	}
	try {
		movesTrial = [6, 9, 20];
		gapsTrial = [1, 2, 3, 4, 5, 7, 8, 10, 11, 13, 14, 16, 17, 19, 22, 23, 25, 28, 31, 34, 37, 43];
		let theNewMove = myNewBot(movesTrial, gapsTrial);
		if(!gapsTrial.includes(theNewMove))
			throw new Error("Your bot picked an illegal move, just a heads up but still acceptable.");
	} catch(err) {
		document.getElementById("errorLog").innerHTML = '<br>' + '<br>' + "Error log: " + '<br>';
		document.getElementById("errorLog").innerHTML += err.message + '<br>';
		console.clear();
		__count = 0;
	}
	finally {
		if(functionalBot){
			document.getElementById("accepted").innerHTML = '<br>' + '<br>' + "Your bot has been accepted. Please return to the main page." + '<br>';
			localStorage.MyNewBot = updatedTemp;
		}
		else{
			document.getElementById("accepted").innerHTML = '<br>' + '<br>' + "Your bot was not accepted. Please try again." + '<br>';
			localStorage.MyNewBot = 'undefined';
		}
	}
}

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