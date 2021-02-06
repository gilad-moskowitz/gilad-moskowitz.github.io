var Alphabet=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']

function myFunction() {
  var plaintext = document.getElementById("demo").innerHTML; 
  let alphaPlain = "";
  for (j = 0; j < plaintext.length; j++) {
  if(plaintext[j].toUpperCase() != plaintext[j].toLowerCase()) alphaPlain += plaintext[j];
  }
  document.getElementById("demo").innerHTML = alphaPlain;
}

function VigenereEncoderAlpha(){
	let plaintext = document.getElementById("plaintext").value;
    if (plaintext.length < 10){
    	alert("Must input plaintext of length at least 10");
        return False;
    }
    let key = document.getElementById("key").value;
    if (key.length < 1){
    	alert("Must input key of length at least 1");
        return False;
    }
    for (i= 0; i < key.length; i++){
    	if(key[i].toUpperCase() == key[i].toLowerCase()){
        alert("Key must be made up of only English letters");
        return False;
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
    document.getElementById("demo2").innerHTML = ciphertext;
}

function VigenereEncoder(){
	let plaintext = document.getElementById("plaintext").value;
    if (plaintext.length < 10){
    	alert("Must input plaintext of length at least 10");
        return False;
    }
    let key = document.getElementById("key").value;
    if (key.length < 1){
    	alert("Must input key of length at least 1");
        return False;
    }
    for (i= 0; i < key.length; i++){
    	if(key[i].toUpperCase() == key[i].toLowerCase()){
        alert("Key must be made up of only English letters");
        return False;
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
    document.getElementById("demo2").innerHTML = ciphertext;
}
