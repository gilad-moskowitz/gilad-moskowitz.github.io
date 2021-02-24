//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xmlhttp = new XMLHttpRequest();
var url = "https://raw.githubusercontent.com/gilad-moskowitz/VigenereCryptanalysis/main/bigramLogFreq.json";
var bigramsLogo;
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        bigramsLogo = JSON.parse(this.responseText);
    }
};
xmlhttp.open("GET", url, false);
xmlhttp.send();

var xmlhttp2 = new XMLHttpRequest();
var url2 = "https://raw.githubusercontent.com/gilad-moskowitz/VigenereCryptanalysis/main/trigramLogFreq.json";
var trigramLogo;
xmlhttp2.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        trigramLogo = JSON.parse(this.responseText);
    }
};
xmlhttp2.open("GET", url2, false);
xmlhttp2.send();

var Alphabet=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
var probabilities = [0.082, 0.015, 0.028, 0.043, 0.127, 0.022, 0.020, 0.061, 0.070, 0.002, 0.008, 0.040, 0.024, 0.067, 0.075, 0.019, 0.001, 0.060, 0.063, 0.091, 0.028, 0.010, 0.023, 0.001, 0.020, 0.001]
var currentTheme = "darkmode";

function sum(array){
    sumTotal = 0;
    for(let i = 0; i < array.length; i++){
        sumTotal += array[i];
    }
    return sumTotal;
}

function gcd(a, b)
{
    if (a == 0)
        return b;
    return gcd(b % a, a);
}

function gcd_of_list(list){
    if(list.length == 0)
        return 0;
    if(list.length == 1)
        return list[0];
    let totalGCD = gcd(list[0], list[1]);
    for(let i = 2; i < list.length; i++){
        totalGCD = gcd(totalGCD, list[i]);
    }
    return totalGCD;
}

function frequencyOfLetters(string, alpha = Alphabet){
    let frequencies = [];
    for(let i = 0; i < alpha.length; i++){
        let count = 0;
        for(let j = 0; j < string.length; j++){
            if (string[j].toLowerCase() == alpha[i])
                count++;
        }
        frequencies.push(count);
    }
    return frequencies;
}


function KasiskiTest(ciphertext, substringlen = 3, start = 0, stop = false){
    let a = 0;
    let test = ciphertext.substring(start, (start + substringlen));
    let duplicateIndices = [];
    while(a < (ciphertext.length - substringlen)){
        duplicate = true;
        for(let i = 0; i < substringlen; i++){
            if(ciphertext[a + i].toLowerCase() != test[i].toLowerCase()) {
                duplicate = false;
                break;
            }
        }
        if(duplicate)
            duplicateIndices.push(a);
        a++;
    }
    let distances = []
    for(let q = 0; q < duplicateIndices.length; q++){
        distances.push(duplicateIndices[q] - duplicateIndices[0]);
    }
    if((distances.length >= 3) || (stop))
        return gcd_of_list(distances);
    else if(start < ciphertext.length - substringlen){
        let newStart = start + 1;
        return KasiskiTest(ciphertext, substringlen, newStart);
    }
    else
        return -1;
}

function indexOfCoincidence(ciphertext, mValue = 1){
	let maxLen = Math.floor(ciphertext.length/mValue);
    let totalIOC = [];
    for(let i = 0; i < mValue; i++){
        substring = "";
        for(let j = 0; j < maxLen; j++){
            substring += ciphertext[i + j*mValue];
        }
        if((i + mValue*maxLen) < ciphertext.length){
            substring += ciphertext[i + mValue*maxLen];
        }
        let freq = frequencyOfLetters(substring);
        let IOC = 0;
        for(let q = 0; q < 26; q++){
            IOC += (freq[q]*(freq[q] - 1))/(substring.length*(substring.length - 1));
        }
        totalIOC.push(IOC);
    }

    return (sum(totalIOC)/totalIOC.length);
}

function findingTheKey(ciphertext, guessedM, prob = probabilities){
    let maxLen = Math.floor(ciphertext.length/guessedM);
    let key = [];
    for(let i = 0; i < guessedM; i++){
        substring = "";
        for(let j = 0; j < maxLen; j++){
            substring += ciphertext[i + j*guessedM];
        }
        if((i + guessedM*maxLen) < ciphertext.length)
            substring += ciphertext[i + guessedM*maxLen];

        let freq = frequencyOfLetters(substring);
        let allM = [];
        for(let g = 0; g < 26; g++){
            let M_g = 0;
            for(let t = 0; t < 26; t++){
                M_g += (prob[t]*freq[(t + g)%26])/substring.length;
            }
            allM.push(Math.abs(M_g - 0.065));
        }
        key.push(allM.indexOf(Math.min(...allM)));
    }
    return key;
}

function keyFinder2gram(ciphertext, m, probabilityDict = bigramsLogo){
    if (m == 1)
        return findingTheKey(ciphertext, m);
    let maxLen = Math.floor(ciphertext.length/m);
    let keyArray = [];
    let cipherTextArray = [];
    for(let i = 0; i < m; i++){
        let substring_list = [];
        for(let j = 0; j < maxLen; j++){
            substring_list.push(ciphertext[i + j*m]);
        }
        if((i + m*maxLen) < ciphertext.length)
            substring_list.push(ciphertext[i + m*maxLen]);
        cipherTextArray.push(substring_list);
    }
    for(let currentValue = 0; currentValue < m; currentValue++){
        let currentBest = [];
        let currentBestScore = 0;
        if (currentValue == (m - 1))
            nextValue = 0;
        else
            nextValue = currentValue + 1;
        let potentialKey;
        for (let g = 0; g < 26; g++){
            for (let g_prime = 0; g_prime < 26; g_prime++){
                potentialKey = [g, g_prime];
                let j = 0;
                let currentScore = 0;
                while(j < Math.min(cipherTextArray[currentValue].length, cipherTextArray[nextValue].length)){
                    let Mstring = Alphabet[(Alphabet.indexOf(cipherTextArray[currentValue][j].toLowerCase()) - g + 26)%26] + Alphabet[(Alphabet.indexOf(cipherTextArray[nextValue][j].toLowerCase()) - g_prime + 26)%26];
                    currentScore += probabilityDict[Mstring];
                    j += 1;
                }
                if ((currentBestScore) == 0 || (currentScore > currentBestScore)){
                    currentBest = [g, g_prime];
                    currentBestScore = currentScore;
                }
                else
                    continue;
            }
        }
        keyArray.push([currentBest, currentBestScore]);
    }
    let firstKeyGuess = findingTheKey(ciphertext, m);
    let key = [];
    for (let ind = 0; ind < firstKeyGuess.length; ind++){
        if ((keyArray[ind][0][0] == firstKeyGuess[ind]) || (keyArray[(ind - 1 + (m - 1))%(m-1)][0][1] == firstKeyGuess[ind]))
        key.push(firstKeyGuess[ind]);
        else{
            if (keyArray[ind][1] > keyArray[(ind - 1 + (m - 1))%(m-1)][1])
                key.push(keyArray[ind][0][0]);
            else
                key.push(keyArray[(ind - 1 + (m - 1))%(m-1)][0][1]);
        }
    }
    return key;
}

function trigramCheck(stringToCheck) {
	let score = 0;
    let i = 0;
    let actualStringToCheck = "";
	for(let j = 0; j < stringToCheck.length; j++){
		if(stringToCheck[j].toUpperCase() != stringToCheck[j].toLowerCase())
			actualStringToCheck += stringToCheck[j];
	}
	while (i <= actualStringToCheck.length - 3) {
        let sub = actualStringToCheck.substring(i, i + 3);
        if (sub.toLowerCase() in trigramLogo){
            score += trigramLogo[sub];
		}
        else
            score += -100;
        i++;
    }
    return score
}

function CryptoAnalysisVigenere(cipherTextFull, maxLenOfKey = 0){
    cipherTextFull = document.getElementById("ciphertext").value;
	//maxLenOfKey = document.getElementById("maxkey").value;
	//if (maxLenOfKey === undefined || maxLenOfKey == "" || maxLenOfKey == NaN)
    //    maxLenOfKey = 0;
	let guessedM;
    let key;
    let plaintext;
    let allPossiblePlainTexts = {};
    let ciphertext = "";
    let skipCount;
	let reversingKey;
	let numericReverseKey = [];
    for (let j = 0; j < cipherTextFull.length; j++){
        if(cipherTextFull[j].toUpperCase() != cipherTextFull[j].toLowerCase())
            ciphertext += cipherTextFull[j];
    }
	if (document.getElementById("key").value != "" && document.getElementById("key").value != undefined){
		reversingKey = document.getElementById("key").value;
		for (i= 0; i < reversingKey.length; i++) {
			numericReverseKey.push(Alphabet.indexOf(reversingKey[i].toLowerCase()))
		}
		let plaintext = "";
		let numberOfSkips = 0;
		for(ele = 0; ele < cipherTextFull.length; ele++){
			if(cipherTextFull[ele].toUpperCase() != cipherTextFull[ele].toLowerCase()){
				plaintext += Alphabet[(Alphabet.indexOf(cipherTextFull[ele].toLowerCase()) - numericReverseKey[(ele - numberOfSkips)%reversingKey.length] + 26)%26];
			}
			else {
				plaintext += cipherTextFull[ele];
				numberOfSkips ++;
			}
		}
		document.getElementById("plaintext").value = plaintext;
		return false
	}
	if(ciphertext.length < 30){
		document.getElementById("plaintext").value = "Ciphertext must have at least 30 english letters";
		return false;
	}
    if(maxLenOfKey < 1)
        maxLenOfKey = Math.floor(Math.sqrt(ciphertext.length));
	for (let i = 3; i < maxLenOfKey; i++) {
        guessedM = KasiskiTest(ciphertext, i, 0);
        if (guessedM !== -1) {
            let mIOC = indexOfCoincidence(ciphertext, guessedM);
            if ((0.055 < mIOC) && (0.075 > mIOC))
                break;
        }
    }
    let testingIOC = [];
	if(guessedM == -1){
		for (let len = 1; len < maxLenOfKey; len++) {
            testingIOC.push(indexOfCoincidence(ciphertext, len));
        }
        for (let j = 0; j < testingIOC.length; j++){
            if((0.05 < testingIOC[j]) && (0.08 > testingIOC[j])){
                let current_m = j + 1;
                key = keyFinder2gram(ciphertext, current_m);
				plaintext = "";
                skipCount = 0;
                for (let g = 0; g < cipherTextFull.length; g++) {
                    if(cipherTextFull[g].toUpperCase() != cipherTextFull[g].toLowerCase())
                        plaintext += Alphabet[((Alphabet.indexOf(ciphertext[g - skipCount].toLowerCase()) - key[(g - skipCount) % current_m]) + 26) % 26];
                    else {
                        plaintext += cipherTextFull[g];
                        skipCount++;
                    }
                }
                allPossiblePlainTexts[j + 1] = [key, plaintext];
            }
        }
    }
    else {
        key = keyFinder2gram(ciphertext, guessedM);
        plaintext = "";
        skipCount = 0;
        for (let j = 0; j < cipherTextFull.length; j++) {
            if(cipherTextFull[j].toUpperCase() != cipherTextFull[j].toLowerCase())
                plaintext += Alphabet[(Alphabet.indexOf(ciphertext[j - skipCount].toLowerCase()) - key[(j - skipCount) % guessedM] + 26) % 26];
            else {
                plaintext += cipherTextFull[j];
                skipCount++;
            }
        }
        allPossiblePlainTexts[guessedM] = [key, plaintext];
    }
	let bestKey = 0;
    let bestKeyScore = 0;
    let currentKeyScore;
    for (let possibility in allPossiblePlainTexts){
		currentKeyScore = trigramCheck(allPossiblePlainTexts[possibility][1]);
        if ((currentKeyScore) > bestKeyScore || (bestKeyScore == 0)) {
            bestKey = possibility;
            bestKeyScore = currentKeyScore;
        }
    }
    let actualKey = "";
    for (let element = 0; element < allPossiblePlainTexts[bestKey][0].length; element++) {
        actualKey += Alphabet[allPossiblePlainTexts[bestKey][0][element]];
    }
	document.getElementById("key").value = actualKey;
	document.getElementById("plaintext").value = allPossiblePlainTexts[bestKey][1];
    return [actualKey, allPossiblePlainTexts[bestKey][1]];
}

function VigenereEncoderAlpha(){
	let plaintext = document.getElementById("plaintext").value;
    if (plaintext.length < 10){
    	document.getElementById("ciphertext").value = "Must input plaintext of length at least 10";
        return false;
    }
    let key = document.getElementById("key").value;
    if (key.length < 1){
    	document.getElementById("ciphertext").value = "Must input key of length at least 1";
        return false;
    }
    for (i= 0; i < key.length; i++){
    	if(key[i].toUpperCase() == key[i].toLowerCase()){
        document.getElementById("ciphertext").value = "Key must be made up of only English letters";
        return false;
        }
    }
    let alphaPlain = "";
    let numericKey = [];
    for (i= 0; i < key.length; i++) {
    	numericKey.push(Alphabet.indexOf(key[i].toLowerCase()))
    }
    for(j = 0; j < plaintext.length; j++){
    	if(plaintext[j].toUpperCase() != plaintext[j].toLowerCase()) alphaPlain += plaintext[j];
    }
    let ciphertext = "";
    for(ele = 0; ele < alphaPlain.length; ele++){
    	ciphertext += Alphabet[(Alphabet.indexOf(alphaPlain[ele].toLowerCase()) + numericKey[ele%key.length])%26];
    }
    document.getElementById("ciphertext").value = ciphertext;
}

function VigenereEncoder(){
	let plaintext = document.getElementById("plaintext").value;
    if (plaintext.length < 10){
		document.getElementById("ciphertext").value = "Must input plaintext of length at least 10";
        return false;
    }
    let key = document.getElementById("key").value;
    if (key.length < 1){
		document.getElementById("ciphertext").value = "Must input key of length at least 1";
        return false;
    }
    for (i= 0; i < key.length; i++){
    	if(key[i].toUpperCase() == key[i].toLowerCase()){
		document.getElementById("ciphertext").value = "Key must be made up of only English letters";
        return false;
        }
    }
    let numericKey = [];
    for (i= 0; i < key.length; i++) {
    	numericKey.push(Alphabet.indexOf(key[i].toLowerCase()))
    }
    let ciphertext = "";
    let numberOfSkips = 0
    for(ele = 0; ele < plaintext.length; ele++){
    	if(plaintext[ele].toUpperCase() != plaintext[ele].toLowerCase()){
        	ciphertext += Alphabet[(Alphabet.indexOf(plaintext[ele].toLowerCase()) + numericKey[(ele - numberOfSkips)%key.length])%26];
        }
        else {
          ciphertext += plaintext[ele];
          numberOfSkips ++;
        }
    }
    document.getElementById("ciphertext").value = ciphertext;
}

