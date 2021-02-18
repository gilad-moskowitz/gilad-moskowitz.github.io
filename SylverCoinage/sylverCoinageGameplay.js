var currentTurnIs = -1;
var movesPlayed = [];
var gamesCounter = 0;
var p1_wins = 0;
var p2_wins = 0;
var p1_penalties = 0;
var p2_penalties = 0;
var ListSmall = [];

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
        return 0;
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
    let newGennies = [];
    for (let t = 0; t < gens.length; t++){
        newGennies.push(parseInt(gens[t]));
    }
    if(newGennies.length < 2 || gcd_list(newGennies) != 1)
        return 0;
    let E = 2*Math.max(...newGennies)*Math.min(...newGennies);
    let listOfElements = [...newGennies];
    let elements = [];
    while (elements.length < E){
        for (let a = 0; a < listOfElements.length; a++){
            elements.push(parseInt(listOfElements[a]));
        }
        listOfElements = SetAdd(listOfElements, newGennies);
        let setList = new Set(elements);
        elements = [...setList].sort(function(a, b) { return a - b; });
    }
    let finalList = [];
    for (let i = 0; i < E/2; i++){
        finalList.push(elements[i]);
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

function getMove(){
    let getNewMove = document.getElementById("move").value;
    document.getElementById("move").value = "";
    return getNewMove;
}

function legalMove(thisMove, movesPlayed){
    if (parseInt(thisMove) < 1)
        return false;
    if (thisMove == "")
        return false;
    if(movesPlayed.length == 0)
        return true;
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
        if(gcd(thisMove, currentGCD) == 1)
            return true;
        else if(gcd(thisMove, currentGCD) == currentGCD){
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

function gameNotComplete(list){
    if (list.includes(1))
        return false;
    else
        return true;
}

function SylverCoinageManual(someMoves){
    currentTurnIs = Math.pow(-1, movesPlayed.length + 1);
    document.getElementById("gameNumber").innerHTML = "Game " + (gamesCounter + 1);
    let theMoves = [];
    for(let r = 0; r < someMoves.length; r++){
        theMoves.push(parseInt(someMoves[r]));
    }
    if(!theMoves.includes(1)){
        let thisGameGCD = gcd_list(theMoves);
        if(thisGameGCD != 1)
            document.getElementById("movesLeft").innerHTML = "There are an infinite number of moves left";
        else if (ListSmall.length == 0) {
            ListSmall = gaps(ListByGensUpToE(theMoves));
            document.getElementById("movesLeft").innerHTML = ListSmall;
        }
        else {
            document.getElementById("movesLeft").innerHTML = ListSmall;
        }
        if (currentTurnIs == -1)
            document.getElementById("currentTurn").innerHTML = "Current Turn: Player 1";
        else
            document.getElementById("currentTurn").innerHTML = "Current Turn: Player 2";
    }
    else {
		document.getElementById("movesLeft").innerHTML = ListSmall;
        if (currentTurnIs == -1){
            p1_wins += 1;
            document.getElementById("currentTurn").innerHTML = "Game Over";
            document.getElementById("GameOver").innerHTML = "Player 1 wins " + "Current Score: " + [p1_wins, p2_wins];
        }
        else {
            p2_wins += 1;
            document.getElementById("currentTurn").innerHTML = "Game Over";
            document.getElementById("GameOver").innerHTML = "Player 2 wins " + "Current Score: " + [p1_wins, p2_wins];
        }
    }
    return [p1_wins, p2_wins];
}

function SylverCoinageVSBot(){
	let theeMoves = [];
    for(let r = 0; r < movesPlayed.length; r++){
        theeMoves.push(parseInt(movesPlayed[r]));
    }
	if(theeMoves.includes(1)){
		ListSmall = [];
		SylverCoinageManual(movesPlayed);
		return 0;
	}
    currentTurnIs = Math.pow(-1, movesPlayed.length + 1);
	if (currentTurnIs == 1){
		let newlyPlayed = alwaysOddBot(movesPlayed, ListSmall);
		if (ListSmall.length == 0){
			if (legalMove(newlyPlayed, movesPlayed)){
				movesPlayed.push(newlyPlayed);
				document.getElementById("movesAlready").innerHTML = movesPlayed;
			}
			else{
				if(currentTurnIs == -1){
					p1_penalties += 1;
					if(p1_penalties >= 3){
						document.getElementById("penalties").innerHTML = "P1 has too many penalties, you lose";
						movesPlayed.push(1);
					}
					else{
						document.getElementById("penalties").innerHTML = "P1 has " + p1_penalties + " penalties, and P2 has " + p2_penalties + " penalties";
					}
				}
				else{
					p2_penalties += 1;
					if(p2_penalties >= 3){
						document.getElementById("penalties").innerHTML = "P2 has too many penalties, you lose";
						movesPlayed.push(1);
						document.getElementById("movesAlready").innerHTML = movesPlayed;
					}
					else{
						document.getElementById("penalties").innerHTML = "P1 has " + p1_penalties + " penalties, and P2 has " + p2_penalties + " penalties";
					}
				}
			}
		}
		else{
			let including = false;
			for(let q = 0; q < ListSmall.length; q++){
				if(parseInt(newlyPlayed) == parseInt(ListSmall[q])){
					including = true;
					break;
				}
			}
			if(including){
				let linearCombos = [];
				for (let j = 0; j < Math.max(...ListSmall); j++){
					if(!ListSmall.includes(j))
						linearCombos.push(j);
				}
				let newGappies = [];
				for(let x = 0; x < ListSmall.length; x++){
					x_stays = true;
					for(let y = 0; y < linearCombos.length; y++){
						if(((ListSmall[x] - linearCombos[y]) >= 0) && ((ListSmall[x] - linearCombos[y])%newlyPlayed == 0)){
							x_stays = false;
							break;
						}
					}
					if(x_stays)
						newGappies.push(ListSmall[x]);
				}
				ListSmall = [...newGappies];
				movesPlayed.push(newlyPlayed);
				document.getElementById("movesAlready").innerHTML = movesPlayed;
			}
			else{
				if(currentTurnIs == -1){
					p1_penalties += 1;
					if(p1_penalties >= 3){
						document.getElementById("penalties").innerHTML = "P1 has too many penalties, you lose";
						movesPlayed.push(1);
					}
					else{
						document.getElementById("penalties").innerHTML = "P1 has " + p1_penalties + " penalties, and P2 has " + p2_penalties + " penalties";
					}
				}
				else{
					p2_penalties += 1;
					if(p2_penalties >= 3){
						document.getElementById("penalties").innerHTML = "P2 has too many penalties, you lose";
						movesPlayed.push(1);
						document.getElementById("movesAlready").innerHTML = movesPlayed;
					}
					else{
						document.getElementById("penalties").innerHTML = "P1 has " + p1_penalties + " penalties, and P2 has " + p2_penalties + " penalties";
					}
				}
			}
		}
	}
	SylverCoinageManual(movesPlayed);
}

function playMove(){
    let newlyPlayed = getMove();
    if (ListSmall.length == 0){
        if (legalMove(newlyPlayed, movesPlayed)){
            movesPlayed.push(newlyPlayed);
            document.getElementById("movesAlready").innerHTML = movesPlayed;
        }
        else{
            if(currentTurnIs == -1){
                p1_penalties += 1;
                if(p1_penalties >= 3){
                    document.getElementById("penalties").innerHTML = "P1 has too many penalties, you lose";
                    movesPlayed.push(1);
                }
                else{
                    document.getElementById("penalties").innerHTML = "P1 has " + p1_penalties + " penalties, and P2 has " + p2_penalties + " penalties";
                }
            }
            else{
                p2_penalties += 1;
                if(p2_penalties >= 3){
                    document.getElementById("penalties").innerHTML = "P2 has too many penalties, you lose";
                    movesPlayed.push(1);
                    document.getElementById("movesAlready").innerHTML = movesPlayed;
                }
                else{
                    document.getElementById("penalties").innerHTML = "P1 has " + p1_penalties + " penalties, and P2 has " + p2_penalties + " penalties";
                }
            }
        }
    }
    else{
        let including = false;
        for(let q = 0; q < ListSmall.length; q++){
            if(parseInt(newlyPlayed) == parseInt(ListSmall[q])){
                including = true;
                break;
            }
        }
        if(including){
            let linearCombos = [];
            for (let j = 0; j < Math.max(...ListSmall); j++){
                if(!ListSmall.includes(j))
                    linearCombos.push(j);
            }
            let newGappies = [];
            for(let x = 0; x < ListSmall.length; x++){
                x_stays = true;
                for(let y = 0; y < linearCombos.length; y++){
                    if(((ListSmall[x] - linearCombos[y]) >= 0) && ((ListSmall[x] - linearCombos[y])%newlyPlayed == 0)){
                        x_stays = false;
                        break;
                    }
                }
                if(x_stays)
                    newGappies.push(ListSmall[x]);
            }
            ListSmall = [...newGappies];
            movesPlayed.push(newlyPlayed);
            document.getElementById("movesAlready").innerHTML = movesPlayed;
        }
        else{
            if(currentTurnIs == -1){
                p1_penalties += 1;
                if(p1_penalties >= 3){
                    document.getElementById("penalties").innerHTML = "P1 has too many penalties, you lose";
                    movesPlayed.push(1);
                }
                else{
                    document.getElementById("penalties").innerHTML = "P1 has " + p1_penalties + " penalties, and P2 has " + p2_penalties + " penalties";
                }
            }
            else{
                p2_penalties += 1;
                if(p2_penalties >= 3){
                    document.getElementById("penalties").innerHTML = "P2 has too many penalties, you lose";
                    movesPlayed.push(1);
                    document.getElementById("movesAlready").innerHTML = movesPlayed;
                }
                else{
                    document.getElementById("penalties").innerHTML = "P1 has " + p1_penalties + " penalties, and P2 has " + p2_penalties + " penalties";
                }
            }
        }
    }
    SylverCoinageManual(movesPlayed);
}

function playMoveVSBot(){
    let newlyPlayed;
    if(currentTurnIs == -1)
        newlyPlayed = getMove();
    else
        newlyPlayed = alwaysOddBot(movesPlayed, ListSmall);
    if (ListSmall.length == 0){
        if (legalMove(newlyPlayed, movesPlayed)){
            movesPlayed.push(newlyPlayed);
            document.getElementById("movesAlready").innerHTML = movesPlayed;
        }
        else{
            if(currentTurnIs == -1){
                p1_penalties += 1;
                if(p1_penalties >= 3){
                    document.getElementById("penalties").innerHTML = "P1 has too many penalties, you lose";
                    movesPlayed.push(1);
                }
                else{
                    document.getElementById("penalties").innerHTML = "P1 has " + p1_penalties + " penalties, and P2 has " + p2_penalties + " penalties";
                }
            }
            else{
                p2_penalties += 1;
                if(p2_penalties >= 3){
                    document.getElementById("penalties").innerHTML = "P2 has too many penalties, you lose";
                    movesPlayed.push(1);
                    document.getElementById("movesAlready").innerHTML = movesPlayed;
                }
                else{
                    document.getElementById("penalties").innerHTML = "P1 has " + p1_penalties + " penalties, and P2 has " + p2_penalties + " penalties";
                }
            }
        }
    }
    else{
        let including = false;
        for(let q = 0; q < ListSmall.length; q++){
            if(parseInt(newlyPlayed) == parseInt(ListSmall[q])){
                including = true;
                break;
            }
        }
        if(including){
            let linearCombos = [];
            for (let j = 0; j < Math.max(...ListSmall); j++){
                if(!ListSmall.includes(j))
                    linearCombos.push(j);
            }
            let newGappies = [];
            for(let x = 0; x < ListSmall.length; x++){
                x_stays = true;
                for(let y = 0; y < linearCombos.length; y++){
                    if(((ListSmall[x] - linearCombos[y]) >= 0) && ((ListSmall[x] - linearCombos[y])%newlyPlayed == 0)){
                        x_stays = false;
                        break;
                    }
                }
                if(x_stays)
                    newGappies.push(ListSmall[x]);
            }
            ListSmall = [...newGappies];
            movesPlayed.push(newlyPlayed);
            document.getElementById("movesAlready").innerHTML = movesPlayed;
        }
        else{
            if(currentTurnIs == -1){
                p1_penalties += 1;
                if(p1_penalties >= 3){
                    document.getElementById("penalties").innerHTML = "P1 has too many penalties, you lose";
                    movesPlayed.push(1);
                }
                else{
                    document.getElementById("penalties").innerHTML = "P1 has " + p1_penalties + " penalties, and P2 has " + p2_penalties + " penalties";
                }
            }
            else{
                p2_penalties += 1;
                if(p2_penalties >= 3){
                    document.getElementById("penalties").innerHTML = "P2 has too many penalties, you lose";
                    movesPlayed.push(1);
                    document.getElementById("movesAlready").innerHTML = movesPlayed;
                }
                else{
                    document.getElementById("penalties").innerHTML = "P1 has " + p1_penalties + " penalties, and P2 has " + p2_penalties + " penalties";
                }
            }
        }
    }
    SylverCoinageVSBot(movesPlayed, ListSmall);
}

function restartGame(){
    movesPlayed = [];
    ListSmall = [];
    currentTurnIs = -1;
    gamesCounter += 1;
    p1_penalties = 0;
    p2_penalties = 0;
    document.getElementById("move").value = "";
    document.getElementById("currentTurn").innerHTML = "Current Turn: Player 1";
    document.getElementById("gameNumber").innerHTML = "Initializing...";
    document.getElementById("movesAlready").innerHTML = "Initializing...";
    document.getElementById("movesLeft").innerHTML = "Initializing...";
    document.getElementById("penalties").innerHTML = "";
    document.getElementById("GameOver").innerHTML = "";
}

function humanPlayer(movesDone, remainingPossibleMoves) {
    return getMove();
}


function alwaysOddBot(doneMoves, stillMoves = []){
    let mathArray = [];
	for(let stupid = 0; stupid < doneMoves.length; stupid++){
		mathArray.push(parseInt(doneMoves[stupid]));
	}
	if (doneMoves.length == 0){
        return getRandomInt(4, 50);
    }
    else if (mathArray.includes(3) && !mathArray.includes(2)){
        return 2;
    }
    else if (mathArray.includes(2) && !mathArray.includes(3)){
        return 3;
    }
	else if (mathArray.includes(2) && mathArray.includes(3)){
		return parseInt(1);
	}
    let myGCD = gcd_list(doneMoves);
    if ((myGCD == 1) && (stillMoves.length == 0)){
        stillMoves = gaps(ListByGensUpToE(doneMoves));
    }
	if (myGCD > 1)
        return (Math.max(...doneMoves) + 1);
    if (stillMoves.length > 1){
        if(stillMoves.length%2 == 0)
            return Math.max(...stillMoves);
        let thisValue = stillMoves.length - 1;
        let linearCombis = [];
        for (let i = 0; i < Math.max(...stillMoves); i++){
            if (!stillMoves.includes(i))
                linearCombis.push(i);
        }
        while(thisValue > 0){
            let pretendMove = stillMoves[thisValue];
			if (pretendMove < 4)
				return Math.max(...stillMoves);
            let positionForOpponent = [];
            for(let x = 0; x < stillMoves.length; x++){
                x_stays = true;
                for(let y = 0; y < linearCombis.length; y++){
                    if(((stillMoves[x] - linearCombis[y]) >= 0) && ((stillMoves[x] - linearCombis[y])%pretendMove == 0)){
                        x_stays = false;
                        break;
                    }
                }
                if(x_stays)
                    positionForOpponent.push(stillMoves[x]);
            }
            if(positionForOpponent.length%2 != 0)
                return pretendMove;
            else
                thisValue--;
        }
		return Math.max(...stillMoves);
    }
    else
        return parseInt(1);
}
