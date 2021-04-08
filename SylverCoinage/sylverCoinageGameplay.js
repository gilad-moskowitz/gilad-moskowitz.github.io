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
var haventSelectedBot = true;
var botChoice = 0;
var possibleBots;


/** Setting Up the Page **/
function settingTheGameUp(){
	if(!playingBot){
		document.getElementById("vsBotGame").style.display = 'none';
		document.getElementById("firstPart").style.display = 'none';
		document.getElementById("secondPart").style.display = 'none';
	}
	if(!playingHuman){
		document.getElementById("vsHumanGame").style.display = 'none';
		document.getElementById("firstPart").style.display = 'none';
		document.getElementById("secondPart").style.display = 'none';
	}
	if(playingBot){
		document.getElementById("vsBotGame").style.display = 'initial';
		document.getElementById("firstPart").style.display = 'initial';
		document.getElementById("secondPart").style.display = 'initial';
	}
	if(playingHuman){
		document.getElementById("vsHumanGame").style.display = 'initial';
		document.getElementById("firstPart").style.display = 'initial';
		document.getElementById("secondPart").style.display = 'initial';
	}
}

function playVSHuman(){
	playingHuman = true;
	document.getElementById("playHuman").style.display = 'none';
	document.getElementById("playBot").style.display = 'none';
	document.getElementById("uploadBot").style.display = 'none';
	document.getElementById("testBot").style.display = 'none';
	document.getElementById("rules").style.display = 'none';
	document.getElementById("selectBot").style.display = 'none';
	settingTheGameUp();
}
function playVSBot(){
	playingBot = true;
	document.getElementById("playHuman").style.display = 'none';
	document.getElementById("playBot").style.display = 'none';
	document.getElementById("uploadBot").style.display = 'none';
	document.getElementById("testBot").style.display = 'none';
	document.getElementById("rules").style.display = 'none';
	settingTheGameUp();
}

function resetGame(){
	playingBot = false;
	playingHuman = false;
	document.getElementById("playHuman").style.display = 'initial';
	document.getElementById("playBot").style.display = 'initial';
	document.getElementById("uploadBot").style.display = 'initial';
	document.getElementById("testBot").style.display = 'initial';
	document.getElementById("rules").style.display = 'initial';
	document.getElementById("selectBot").style.display = 'initial';
	gamesCounter = -1;
	restartGame();
	settingTheGameUp();
}

/** Reset all parameters **/
function restartGame(){
	gamesCounter += 1;
    currentTurn = Math.pow(-1, (gamesCounter+1));
    movesPlayed = [];
    p1Penalties = 0;
    p2Penalties = 0;
    remainingGaps = [];
	relations = [];
	currentGCD = -1;
    document.getElementById("move").value = "";
	if(currentTurn == -1){
		document.getElementById("currentTurn").innerHTML = "Current Turn: Player 1";
		document.getElementById("selectBot").style.display = 'initial';
		haventSelectedBot = true;
	}
	if(playingHuman)
		document.getElementById("selectBot").style.display = 'none';
	else
		document.getElementById("currentTurn").innerHTML = "Current Turn: Player 2";
    document.getElementById("gameNumber").innerHTML = "Game " + (gamesCounter + 1);
    document.getElementById("movesAlready").innerHTML = "(Waiting for first move)";
    document.getElementById("movesLeft").innerHTML = "(Waiting for first move)";
	document.getElementById("remainingMoves").innerHTML = "";
    document.getElementById("penalties").innerHTML = "";
    document.getElementById("GameOver").innerHTML = "";
	document.getElementById("gameButton").style.display = 'initial';
	document.getElementById("myDynamicTable").innerHTML = "";
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





/** SPECIAL CODE FOR THE BEST BOT (NO ACTUAL ACCESS TO PLAY AGAINST IT YET **/
/** SPECIAL CODE FOR THE BEST BOT (NO ACTUAL ACCESS TO PLAY AGAINST IT YET **/
/** SPECIAL CODE FOR THE BEST BOT (NO ACTUAL ACCESS TO PLAY AGAINST IT YET **/
/** SPECIAL CODE FOR THE BEST BOT (NO ACTUAL ACCESS TO PLAY AGAINST IT YET **/
function coversRelations(gap){
    let linComb = []
    for(let j = 0; j < Math.max(...gap); j++){
        if(!gap.includes(j)){
            linComb.push(j);
        }
    }
    let dictionary = {};
    for (let i = 0; i < gap.length; i++){
        let covers = [];
        for (let j = i + 1; j < gap.length; j++){
            for (let k = 0; k < linComb.length; k++){
                if(gap[j] - linComb[k] < gap[i])
                    break;
                if(((gap[j] - linComb[k]) > 0) && ((gap[j] - linComb[k])%gap[i] == 0)){
                    covers.push(gap[j]);
                    break;
                }
            }
        }
        dictionary[gap[i]] = covers;
    }
    return dictionary
}


// NEW CODE BELOW:
function pretendMove(gaps, pretend){
    let pretendCovers = coversRelations(gaps);
    let newyGaps = [];
    for(let current = 0; current < gaps.length; current++){
        if((!pretendCovers[pretend].includes(gaps[current])) && (gaps[current] != pretend))
            newyGaps.push(gaps[current]);
    }
    return newyGaps;
}

function singletons(gaps, alreadyPair = []){
    let covers = coversRelations(gaps);
    let singles = [];
    for(let f = 0; f < gaps.length; f++){
        let isSingle = true;
        for(let g = f + 1; g < gaps.length; g++){
            if(!covers[gaps[f]].includes(gaps[g])){
                isSingle = false;
                break;
            }
        }
        if(alreadyPair.includes(gaps[f]))
            isSingle = false;
        if(isSingle){
            singles.push(gaps[f]);
        }
    }
    let nonSingle = [];
    for(let testing = 0; testing < gaps.length; testing++){
        if(!singles.includes(gaps[testing]))
            nonSingle.push(gaps[testing]);
    }
    if(((nonSingle.length)%2 != 0) && (singles.length > 1))
        singles.splice(1, 1);
    singles.sort(function(a, b) { return a - b; });
    return singles;
}

function pairings(gaps){
    let nextStage = [];
    let possibles = [];
    let firstCheckFind = false;
    let isPairing = true;
    let singleLadies = singletons(gaps)
    let tempGaps = gaps.slice(1, gaps.length);
    let newGaps = gaps;
    let covers = coversRelations(gaps);
    let pairs = [];
    let alreadyPaired = [];
    let notPairs = [];
    let start = 0;
    let end = tempGaps.length;
    let noNewSingles = true;
    while(start < end){
        let a = parseInt(tempGaps[start]);
        nextStage = pretendMove(newGaps, a);
        firstCheckFind = false;
        if((alreadyPaired.length) > 0){
            covers = coversRelations(nextStage);
            for(let checkingPair = 0; checkingPair < nextStage.length; checkingPair++){
                let g = parseInt(nextStage[checkingPair]);
                if((g > a) && (!alreadyPaired.includes(g))){
                    let remaining = []
                    for(let rem = 0; rem < nextStage.length; rem++){
                        if((parseInt(nextStage[rem]) > 1) && (!covers[g].includes(parseInt(nextStage[rem]))) && (g != parseInt(nextStage[rem])))
                            remaining.push(parseInt(nextStage[rem]));
                    }
                    if((remaining.length)%2 != 0)
                        continue;
                    isPairing = true;
                    for(let b = 0; b < remaining.length; b++){
                        if(!alreadyPaired.includes(parseInt(remaining[b]))){
                            isPairing = false;
                            break
                        }
                    }
                    if(isPairing){
                        pairs.push([a, g]);
                        alreadyPaired.push(a);
                        alreadyPaired.push(g);
                        start = 0;
                        tempGaps.splice(tempGaps.indexOf(a), 1);
                        tempGaps.splice(tempGaps.indexOf(g), 1);
                        end = tempGaps.length;
                        firstCheckFind = true;
                        break
                    }
                }
            }
        }
        if(!firstCheckFind) {
            let newSingles = singletons(nextStage, alreadyPaired);
            for (let singleCheck = 0; singleCheck < newSingles.length; singleCheck++) {
                let g = parseInt(newSingles[singleCheck]);
                if (tempGaps.includes(g)) {
                    pairs.push([a, g]);
                    alreadyPaired.push(a);
                    alreadyPaired.push(g);
                    start = 0;
                    tempGaps.splice(tempGaps.indexOf(a), 1);
                    tempGaps.splice(tempGaps.indexOf(g), 1);
                    end = tempGaps.length;
                    firstCheckFind = true;
                    break
                }
            }
        }
        if(!firstCheckFind) {
            let newSingles = singletons(nextStage, alreadyPaired);
            let newTempGaps = [];
            for(let i = 0; i < nextStage.length; i++){
                if(!newSingles.includes(parseInt(nextStage[i])))
                    newTempGaps.push(parseInt(nextStage[i]))
            }
            if((newTempGaps.length)%2 == 1){
                possibles = [];
                for(let j = 0; j < newTempGaps.length; j++){
                    if((parseInt(newTempGaps[j]) > a) && (tempGaps.includes(parseInt(newTempGaps[j]))))
                        possibles.push(parseInt(newTempGaps[j]));
                }
                if(possibles.length == 0){
                    if(!notPairs.includes(a)){
                        notPairs.push(a);
                        newGaps = pretendMove(newGaps, a);
                        tempGaps = [...newGaps];
                        tempGaps.splice(tempGaps.indexOf(1), 1);
                        pairs = [];
                        alreadyPaired = [];
                        start = 0;
                        end = tempGaps.length;
                    }
                    else
                        start += 1;
                    continue
                }
                let d = Math.min(...possibles)
                pairs.push([a, d]);
                alreadyPaired.push(a);
                alreadyPaired.push(d);
                start = 0;
                tempGaps.splice(tempGaps.indexOf(a), 1);
                tempGaps.splice(tempGaps.indexOf(d), 1);
                end = tempGaps.length;
            }
            else {
                if(!notPairs.includes(a)){
                    notPairs.push(a);
                    newGaps = pretendMove(newGaps, a);
                    tempGaps = [...newGaps];
                    tempGaps.splice(tempGaps.indexOf(1), 1);
                    pairs = [];
                    alreadyPaired = [];
                    start = 0;
                    end = tempGaps.length;
                }
                else
                    start += 1;
            }
        }
    }
    let newEnd = notPairs.length;
    while(newEnd > 1){
        pairs.push([notPairs[0], notPairs[1]]);
        notPairs.splice(0, 2);
        newEnd = notPairs.length;
    }
    return [pairs, notPairs, singleLadies];
}

function maybeSolved(){
    let remainingMoves = remainingGaps;
    let alreadyMoved = movesPlayed;
    let myPairs = [];
    if((alreadyMoved.length == 1) && (alreadyMoved.includes(4))){
        return 6;
    }
    else if((alreadyMoved.length == 1) && (alreadyMoved.includes(6))){
        return 4;
    }
    if((remainingMoves.length > 0) && (remainingMoves.length < 100) && (alreadyMoved.length != 0)){
        myPairs = pairings(remainingMoves);
        if(myPairs[1].length > 0) {
            return Math.min(myPairs[1]);
        }
        else{
            //DO WHENEVER WE DON'T KNOW WHAT ELSE TO DO
            if(remainingMoves.length%2 == 0)
                return Math.max(...remainingMoves);
            let thisValue = remainingMoves.length - 1;
            let linearCombis = [];
            for (let i = 0; i < Math.max(...remainingMoves); i++){
                if (!remainingMoves.includes(i))
                    linearCombis.push(i);
            }
            while(thisValue > 0){
                let pretendMove = remainingMoves[thisValue];
                if (pretendMove < 4)
                    return Math.max(...remainingMoves);
                let positionForOpponent = [];
                for(let x = 0; x < remainingMoves.length; x++){
                    let x_stays = true;
                    for(let y = 0; y < linearCombis.length; y++){
                        if(((remainingMoves[x] - linearCombis[y]) >= 0) && ((remainingMoves[x] - linearCombis[y])%pretendMove == 0)){
                            x_stays = false;
                            break;
                        }
                    }
                    if(x_stays)
                        positionForOpponent.push(remainingMoves[x]);
                }
                if(positionForOpponent.length%2 != 0)
                    return pretendMove;
                else
                    thisValue--;
            }
            return Math.max(...remainingMoves);
        }
    }
    else if (alreadyMoved.length == 0){
        let possibility = getRandomInt(1, 8);
        let primes = [5, 5, 7, 11, 13, 17, 19, 23, 29];
        return primes[possibility];
    }
    else if ((currentGCD > 1) && (alreadyMoved.length == 1)){
        let factor = PrimeFactorization(parseInt(alreadyMoved[0]))
        if ((factor.length == 1) && (parseInt(alreadyMoved[0]) > 10))
            return 9;
        else if (factor.length == 1)
            return (parseInt(alreadyMoved[0]) + 1);
        else{
            for(let e = 0; e < factor.length; e++){
                if(parseInt(factor[e]) > 3)
                    return parseInt(factor[e]);
            }
            if(parseInt(alreadyMoved[0]) > 16)
                return 16;
            else
                return (parseInt(alreadyMoved[0]) + 1);
        }
    }
    else{
        let gcd_moves = gcd_list(alreadyMoved);
        let newSet = []
        for(let i = 0; i < alreadyMoved.length; i++){
            newSet.push(alreadyMoved[i]/gcd_moves);
        }
        remainingMoves = gaps(ListByGensUpToE(newSet));
        if((remainingMoves.length <= 1) && (gcd_moves > 1)){
            return (gcd_moves*2 + 1);
        }
        else{
            //DO WHENEVER WE DON'T KNOW WHAT ELSE TO DO
            if(remainingMoves.length%2 == 0)
                return Math.max(...remainingMoves);
            let thisValue = remainingMoves.length - 1;
            let linearCombis = [];
            for (let i = 0; i < Math.max(...remainingMoves); i++){
                if (!remainingMoves.includes(i))
                    linearCombis.push(i);
            }
            while(thisValue > 0){
                let pretendMove = remainingMoves[thisValue];
                if (pretendMove < 4)
                    return Math.max(...remainingMoves);
                let positionForOpponent = [];
                for(let x = 0; x < remainingMoves.length; x++){
                    let x_stays = true;
                    for(let y = 0; y < linearCombis.length; y++){
                        if(((remainingMoves[x] - linearCombis[y]) >= 0) && ((remainingMoves[x] - linearCombis[y])%pretendMove == 0)){
                            x_stays = false;
                            break;
                        }
                    }
                    if(x_stays)
                        positionForOpponent.push(remainingMoves[x]);
                }
                if(positionForOpponent.length%2 != 0)
                    return pretendMove;
                else
                    thisValue--;
            }
            return Math.max(...remainingMoves);
        }
    }
}
/** SPECIAL CODE FOR THE BEST BOT (NO ACTUAL ACCESS TO PLAY AGAINST IT YET **/
/** SPECIAL CODE FOR THE BEST BOT (NO ACTUAL ACCESS TO PLAY AGAINST IT YET **/
/** SPECIAL CODE FOR THE BEST BOT (NO ACTUAL ACCESS TO PLAY AGAINST IT YET **/
/** SPECIAL CODE FOR THE BEST BOT (NO ACTUAL ACCESS TO PLAY AGAINST IT YET **/






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
    if((movesPlayed.length == 1) && (movesPlayed.includes(4))){
        return 6;
    }
    else if((movesPlayed.length == 1) && (movesPlayed.includes(6))){
        return 4;
    }
    if(movesPlayed.length >= 2){
        let fourFiveEleven = [0, 0, 0];
        let arrayOf4511 = [4, 5, 11];
        for(let i = 0; i < movesPlayed.length; i++){
            let currentTest = parseInt(movesPlayed[i]);
            if(currentTest == 4){
                fourFiveEleven[0] = 1;
            }
            if(currentTest == 5){
                fourFiveEleven[1] = 1;
            }
            if(currentTest == 11){
                fourFiveEleven[2] = 1;
            }
        }
        let currentThree = 0;
        for(let j = 0; j < 3; j++){
            currentThree += fourFiveEleven[j];
        }
        if((currentThree == 2) && (!movesPlayed.includes(6)) && (!movesPlayed.includes(7))){
            for(let f = 0; f < 3; f++){
                if(fourFiveEleven[f] == 0){
                    return arrayOf4511[f];
                }
            }
        }
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
    if((movesPlayed.length == 1) && (movesPlayed.includes(4))){
        return 6;
    }
    else if((movesPlayed.length == 1) && (movesPlayed.includes(6))){
        return 4;
    }
    if(movesPlayed.length >= 2){
        let fourFiveEleven = [0, 0, 0];
        let arrayOf4511 = [4, 5, 11];
        for(let i = 0; i < movesPlayed.length; i++){
            let currentTest = parseInt(movesPlayed[i]);
            if(currentTest == 4){
                fourFiveEleven[0] = 1;
            }
            if(currentTest == 5){
                fourFiveEleven[1] = 1;
            }
            if(currentTest == 11){
                fourFiveEleven[2] = 1;
            }
        }
        let currentThree = 0;
        for(let j = 0; j < 3; j++){
            currentThree += fourFiveEleven[j];
        }
        if((currentThree == 2) && (!movesPlayed.includes(6)) && (!movesPlayed.includes(7))){
            for(let f = 0; f < 3; f++){
                if(fourFiveEleven[f] == 0){
                    return arrayOf4511[f];
                }
            }
        }
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
    if((movesPlayed.length == 1) && (movesPlayed.includes(4))){
        return 6;
    }
    else if((movesPlayed.length == 1) && (movesPlayed.includes(6))){
        return 4;
    }
    if(movesPlayed.length >= 2){
        let fourFiveEleven = [0, 0, 0];
        let arrayOf4511 = [4, 5, 11];
        for(let i = 0; i < movesPlayed.length; i++){
            let currentTest = parseInt(movesPlayed[i]);
            if(currentTest == 4){
                fourFiveEleven[0] = 1;
            }
            if(currentTest == 5){
                fourFiveEleven[1] = 1;
            }
            if(currentTest == 11){
                fourFiveEleven[2] = 1;
            }
        }
        let currentThree = 0;
        for(let j = 0; j < 3; j++){
            currentThree += fourFiveEleven[j];
        }
        if((currentThree == 2) && (!movesPlayed.includes(6)) && (!movesPlayed.includes(7))){
            for(let f = 0; f < 3; f++){
                if(fourFiveEleven[f] == 0){
                    return arrayOf4511[f];
                }
            }
        }
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
    if((movesPlayed.length == 1) && (movesPlayed.includes(4))){
        return 6;
    }
    else if((movesPlayed.length == 1) && (movesPlayed.includes(6))){
        return 4;
    }
    if(movesPlayed.length >= 2){
        let fourFiveEleven = [0, 0, 0];
        let arrayOf4511 = [4, 5, 11];
        for(let i = 0; i < movesPlayed.length; i++){
            let currentTest = parseInt(movesPlayed[i]);
            if(currentTest == 4){
                fourFiveEleven[0] = 1;
            }
            if(currentTest == 5){
                fourFiveEleven[1] = 1;
            }
            if(currentTest == 11){
                fourFiveEleven[2] = 1;
            }
        }
        let currentThree = 0;
        for(let j = 0; j < 3; j++){
            currentThree += fourFiveEleven[j];
        }
        if((currentThree == 2) && (!movesPlayed.includes(6)) && (!movesPlayed.includes(7))){
            for(let f = 0; f < 3; f++){
                if(fourFiveEleven[f] == 0){
                    return arrayOf4511[f];
                }
            }
        }
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


/** CODE TO PLAY THE BOT'S MOVE **/
function playBotMove(){
    if((currentTurn == 1) && (document.getElementById("currentTurn").innerHTML != "Game Over")) {
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
	if(haventSelectedBot){
		document.getElementById("selectBot").style.display = 'none';
		haventSelectedBot = false;
		botChoice = document.getElementById("botSelector").value;
	}
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
    playBotMove();
}


function playMoveVSHuman(){
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
}



/* UX CODE */
function addTable() {
	if(remainingGaps.length > 0){
		let t = Math.ceil((remainingGaps.length)/5);
		
		var myTableDiv = document.getElementById("myDynamicTable");
		myTableDiv.innerHTML = "";
		var table = document.createElement('TABLE');
		table.border = '1';

		var tableBody = document.createElement('TBODY');
		table.appendChild(tableBody);

		for (var i = 0; i < t; i++) {
			var tr = document.createElement('TR');
			tableBody.appendChild(tr);

			for (var j = 0; j < 5; j++) {
				var td = document.createElement('TD');
				td.width = '75';
				td.setAttribute('class', 'possibleMove');
				if(i*5 + j < remainingGaps.length){
					td.setAttribute('id', remainingGaps[i*5 + j]);
					td.appendChild(document.createTextNode(remainingGaps[i*5 + j]));
				} else{
					td.setAttribute('id', "NotAllowed");
					td.appendChild(document.createTextNode(""));
				}
				tr.appendChild(td);
				}
		}
		myTableDiv.appendChild(table);
		
		var tds = document.getElementsByClassName("possibleMove");
		var getID = function() {
				let newlyPlayed = parseInt(this.id);
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
				if(playingBot){playBotMove();}
			}
		
		var removeHighlight = function removingHighlights() {
			for(let i = 0; i < tds.length; i++) {
				document.getElementById(tds[i].id).style.backgroundColor = "inherit";
			}
		}

		for(var i = 0; i < tds.length; i++) {
			if(tds[i].id != "NotAllowed"){
				tds[i].onclick = getID;
				tds[i].onmouseover = highlight;
				tds[i].onmouseout = removeHighlight;
			}
		};
	}
}

var highlight = function highlightKilling() {
	let eliminator = parseInt(this.id);
	document.getElementById(eliminator).style.backgroundColor = "#ffb3b3";
	for (let i = 0; i < relations[eliminator].length; i++){
		current = relations[eliminator][i];
		current = current.toString();
		document.getElementById(current).style.backgroundColor = "#ffb3b3";
	}
}



function coverRelations(gap, linComb){
	let dictionary = {};
    for (let i = 0; i < gap.length; i++){
        let covers = [];
        for (let j = i + 1; j < gap.length; j++){
            for (let k = 0; k < linComb.length; k++){
                if(gap[j] - linComb[k] < gap[i])
                    break;
                if(((gap[j] - linComb[k]) > 0) && ((gap[j] - linComb[k])%gap[i] == 0)){
                    covers.push(gap[j]);
                    break;
				}
			}
		}
        dictionary[gap[i]] = covers;
    }
	return dictionary
}



function checkIfBotAvailable() {
	if(localStorage.MyNewBot == "undefined" || localStorage.MyNewBot == undefined){
		document.getElementById("testBot").innerText = "No bot available";
		document.getElementById("testBot").disabled = true;
		document.getElementById("testBot").classList.remove('gameStartButton');
		document.getElementById("testBot").classList.add('disabledGameStartButton');
		document.getElementById("uploadedBot1").style.display = 'none';
		possibleBots = [alwaysOddBot, alwaysMaxBot, alwaysMinBot, alwaysRandomBot];
	}
	else {
		document.getElementById("testBot").innerText = "Test Uploaded Bot";
		document.getElementById("testBot").disabled = false;
		document.getElementById("testBot").classList.remove('disabledGameStartButton');
		document.getElementById("testBot").classList.add('gameStartButton');
		document.getElementById("uploadedBot1").style.display = 'initial';
		//Loading the bot
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
		possibleBots = [alwaysOddBot, alwaysMaxBot, alwaysMinBot, alwaysRandomBot, myNewBot];
	}
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