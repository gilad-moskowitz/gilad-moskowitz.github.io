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
var numberGames = 1;
var winsAndLosses = [];
var haventSelectedBot = true;
var botChoice = 0;
/** Information for table of wins and losses **/
var winsPerBot = [0, 0, 0, 0];
var lossesPerBot = [0, 0, 0, 0];

/** Reset all parameters **/
function restartGame(){
	document.getElementById("statsTable").style.display = 'initial';
	gamesCounter = 0;
    currentTurn = Math.pow(-1, (gamesCounter+1));
    movesPlayed = [];
    p1Penalties = 0;
    p2Penalties = 0;
	p1Wins = 0;
	p2Wins = 0;
    remainingGaps = [];
	relations = [];
	currentGCD = -1;
	haventSelectedBot = true;
    document.getElementById("numGames").value = "";
    document.getElementById("results").innerHTML = "";
    document.getElementById("outputResults").innerHTML = "";
	document.getElementById("initializing").style.display = 'initial';
	document.getElementById("selectBot").style.display = 'initial';
	if(currentTurn == 1 && playingBot == true)
		playBotMove();
    return 0;
}

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
		for(let i = 0; i < movesPlayed.length; i++){
			if(thisMove%movesPlayed[i] == 0)
				return false
		}
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

/** Code for bots **/
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

function alwaysMaxBot() {
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
        return Math.max(...remainingGaps);
    }
    else
        return parseInt(1);
}

function alwaysMinBot() {
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
    if (remainingGaps.length > 3){
        return parseInt(remainingGaps[3]);
    }
	else if (remainingGaps.length > 1){
		return Math.max(...remainingGaps);
	}
    else
        return parseInt(1);
}

function alwaysRandomBot() {
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
    if (remainingGaps.length > 3){
		let randomChoice = getRandomInt(3, remainingGaps.length - 1);
        return parseInt(remainingGaps[randomChoice]);
    }
	else if (remainingGaps.length > 1){
		return Math.max(...remainingGaps);
	}
    else
        return parseInt(1);
}

var possibleBots = [alwaysOddBot, alwaysMaxBot, alwaysMinBot, alwaysRandomBot];


/** CODE TO PLAY BOT MOVE **/
function playBotMove(){
    if((currentTurn == 1) && gameNotComplete(movesPlayed)) {
        let botMove = possibleBots[botChoice]();
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

/* Play new bot move */
function playNewBotMove(){
    if((currentTurn == -1) && gameNotComplete(movesPlayed)) {
        let botMove = myNewBot(movesPlayed, remainingGaps);
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
    currentTurn = Math.pow(-1, movesPlayed.length + gamesCounter + 1);
    if(currentGCD != 1)
        currentGCD = gcd_list(movesPlayed);
    if(gameNotComplete(movesPlayed)){
        if(remainingGaps.length == 0 && currentGCD == 1){
            remainingGaps = gaps(ListByGensUpToE(movesPlayed));
		}
    }
    else {
        if (currentTurn == -1){
            p1Wins += 1;
			winsPerBot[botChoice] += 1;
        }
        else {
            p2Wins += 1;
			lossesPerBot[botChoice] += 1;
        }
    }
	winsAndLosses = [p1Wins, p2Wins];
    return winsAndLosses;
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

/* Upload the bot */
function loadBot(){
	var temp = localStorage.MyNewBot;
    var newFunction = "<script>" + temp + "</script>";
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
}

/* Automated Playing Code */
function numberOfGames() {
	let tempValue = parseInt(document.getElementById("numbOfGame").value);
	document.getElementById("numbOfGame").value = "";
	if (tempValue >= 1)
		numberGames = tempValue;
	else
		document.getElementById("mustHave").innerHTML = "Must have at least 1 game";
	document.getElementById("initializing").style.display = 'none';
	if(haventSelectedBot){
		document.getElementById("selectBot").style.display = 'none';
		haventSelectedBot = false;
		botChoice = document.getElementById("botSelector").value;
	}
	automatedTest();
}

function automatedTest() {
	document.getElementById("statsTable").style.display = 'none';
	while(gamesCounter < numberGames){
		currentTurn = Math.pow(-1, (gamesCounter+1));
		while(gameNotComplete(movesPlayed)){
			if(currentTurn == -1){
				playNewBotMove();
			}
			else{
				playBotMove();
			}
		}
		document.getElementById("results").innerHTML = "Results: ";
		let printResult = '<br>';
		printResult += "Game " + (gamesCounter + 1) + "<br>";
		printResult += "Moves played this game: "
		printResult += movesPlayed.join(', ');
		printResult += "<br> Wins/Losses: ";
		printResult += winsAndLosses.join(', ');
		printResult += "<br> Penalties: ";
		printResult += [p1Penalties, p2Penalties].join(', ');
		printResult += "<br>";
		document.getElementById("outputResults").innerHTML += printResult;
		movesPlayed = [];
		remainingGaps = [];
		currentGCD = -1;
		gamesCounter += 1;
	}
	document.getElementById("t1Wins").innerHTML = winsPerBot[0];
	document.getElementById("t1Losses").innerHTML = lossesPerBot[0];
	document.getElementById("t2Wins").innerHTML = winsPerBot[1];
	document.getElementById("t2Losses").innerHTML = lossesPerBot[1];
	document.getElementById("t3Wins").innerHTML = winsPerBot[2];
	document.getElementById("t3Losses").innerHTML = lossesPerBot[2];
	document.getElementById("t4Wins").innerHTML = winsPerBot[3];
	document.getElementById("t4Losses").innerHTML = lossesPerBot[3];
}


/* CODE FOR USER UPLOAD */
var __count = 0;
const __detectInfiniteLoop = () => {
	if(__count > 10000000) {
		throw new Error('Infinite Loop detected');
	}
	__count += 1;
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