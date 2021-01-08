//Initialize Database
const firebaseConfig = {
    apiKey: "AIzaSyCKnIn4SsMC74rTGqekjSw8OvLwWe88bbI",
    authDomain: "party-smart-tcod.firebaseapp.com",
    databaseURL: "https://party-smart-tcod.firebaseio.com",
    projectId: "party-smart-tcod",
    storageBucket: "party-smart-tcod.appspot.com",
    messagingSenderId: "332152048668",
    appId: "1:332152048668:web:9adf5fb209d803b8d4e3d9"
  };
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();




//Initialize List Read file and import
var names = []
var inParty = []
document.getElementById('inputfile') .addEventListener('change', function loadFile() 
        { 
            var fr=new FileReader(); 
            fr.onload=function(){ 

              //Loads .txt file into array and loacl variable
              names = (fr.result.split('\n')); 
              localStorage.setItem('names', JSON.stringify(names));

              //turns names into json objects
              strToObject();
            } 
            fr.readAsText(this.files[0]);
            
        }) 


//Helper function to turn the guest list into an array of objects to assign data to 
function strToObject()
{
  guestList = [];

  names.forEach(function (element, index) { 
  guestList.push({
        name: element,
        Inside: "no",
        TimeIn: "n/a",
        TimeOut: "n/a",
  })
  firebase.database().ref().set({
    guestList
  });
  
});
}


//Actively read data from firebase to print to UI
var ref = database.ref('guestList')
ref.on('value', gotData, errData);

function gotData(data){
  document.getElementById("names").innerHTML = "";
  var scores = data.val();
  var keys = Object.keys(scores);

  var ul = document.getElementById("names");
  for ( var i=0; i < keys.length; i++){
    var k = keys[i];
    var names = scores[k].name;
    var inside = scores[k].Inside;

    var a =document.createElement("a");
    var li = document.createElement('li');

    a.textContent= names;
    a.setAttribute('href', "http://riley-griffis.s3-website.us-east-2.amazonaws.com/")
    li.appendChild(a);
    ul.appendChild(li);
  }
}

function errData(err){
  console.log('Error!');
  console.log(err);
}



//clears guest list on screen
function printArray(list) {
  
console.log(guestList)
;}



//Check in
function checkIn() {
    //Grabs current guest to be added or deleted from form text box
    var name = document.getElementById('UsersName').value;
    
    //Checks to see if user is in list of guests and isn't in the list of guest in the party
    
    var guestsRef = firebase.database().ref("guestList/");

    guestsRef.orderByChild("name").on("child_added", function(data) {
    if (name == data.val().name) {
      objIndex = guestList.findIndex((obj => obj.name == name));
      guestsRef = firebase.database().ref("guestList/" + objIndex)
      guestsRef.update({
        Inside: "Yes",
        TimeIn: getTime(),
        TimeOut: "n/a",

      })
      alert(name + " has been checked in!")
    } 
  })
  }

  //Returns time
  function addZero(i) {
    if (i < 10) {
    i = "0" + i;
  }
  return i;
  }

  function getTime() {
    var d = new Date();
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());
    var currentTime = h + ":" + m + ":" + s;

    return currentTime;
}

  function checkOut(){
    const index = guestList.indexOf('LeavingUsersName');
    if (index > -1) {
    guestList.splice(index, 1);
    }
    inParty.push(document.getElementById('LeavingUsersName').value)
    localStorage.setItem('guestlist', JSON.stringify(guestList));
    localStorage.setItem('inParty', JSON.stringify(inParty));

  }
  

//Counter
function clickCounter() {
    if (typeof(Storage) !== "undefined") {
      if (localStorage.clickcount) {
        localStorage.clickcount = Number(localStorage.clickcount)+1;
      } else {
        localStorage.clickcount = 1;
      }
      document.getElementById("result").innerHTML = "You have clicked the button " + localStorage.clickcount + " time(s).";
    } else {
      document.getElementById("result").innerHTML = "Sorry, your browser does not support web storage...";
    }
  }


  function myFunction() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("names");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

