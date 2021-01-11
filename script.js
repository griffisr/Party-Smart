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




//-------------------- User Uploaded List -------------------------

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
        Inside: "No",
        TimeIn: "n/a",
        TimeOut: "n/a",
  })
  firebase.database().ref().set({
    guestList
  });
  
});
}


//-------------------- Check In and Check In Helper Functions -------------------------

//Helper Function to Grab current List index
function printArray() {
  var ref = database.ref('guestList')
  ref.on('value', readData, errData);
  }
function readData(data){
  guestList=[];
  var scores = data.val();
  var keys = Object.keys(scores)

  for (var i=0; i < keys.length; i++){
    var k = keys[i]
    var name = scores[k].name;
    var inside = scores[k].Inside;
    var timeIn = scores[k].TimeIn;
    var timeOut = scores[k].TimeOut;
    guestList[i] = {
        name: name,
        Inside: inside,
        TimeIn: timeIn,
        TimeOut: timeOut,
    }
  }
  checkIn(guestList);
}

function errData(err){
  console.log('Error!');
  console.log(err);
}
//Helper Function to set text box to selected name
function checkInn(name){
  console.log(name)
  document.getElementById('checkIn').value = name;
}
//Check in
function checkIn(list) {
 
    //Grabs current guest to be added or deleted from form text box
    var name = document.getElementById('checkIn').value;

    //Checks to see if user is in list of guests and isn't in the list of guest in the party
    
    var guestsRef = firebase.database().ref("guestList/");

    guestsRef.orderByChild("name").on("child_added", function(data) {
    if (name == data.val().name) {
      objIndex = list.findIndex((obj => obj.name == name));
      guestsRef = firebase.database().ref("guestList/" + objIndex)
      guestsRef.update({
        Inside: "Yes",
        TimeIn: getTime(),
      })
      guestsRef.off();
      document.getElementById('checkIn').value = "";
      alerts(name, true)
    } 
  })
  }

//------------------------- Check Out ------------------------------------------------------------
//Helper Function to Grab current List index
function printArrayy() {
  var ref = database.ref('guestList')
  ref.on('value', readOutData, errData);
  }
function readOutData(data){
  guestList=[];
  var scores = data.val();
  var keys = Object.keys(scores)

  for (var i=0; i < keys.length; i++){
    var k = keys[i]
    var name = scores[k].name;
    var inside = scores[k].Inside;
    var timeIn = scores[k].TimeIn;
    var timeOut = scores[k].TimeOut;
    guestList[i] = {
        name: name,
        Inside: inside,
        TimeIn: timeIn,
        TimeOut: timeOut,
    }
  }
  checkOut(guestList);
}

//Helper Function to set text box to selected name
function checkOutt(name){
  console.log(name);
  document.getElementById('checkOut').value = name;
}
//Check Out
function checkOut(list) {
 
    //Grabs current guest to be added or deleted from form text box
    var name = document.getElementById('checkOut').value;

    //Checks to see if user is in list of guests and isn't in the list of guest in the party
    
    var guestsRef = firebase.database().ref("guestList/");

    guestsRef.orderByChild("name").on("child_added", function(data) {
    if (name == data.val().name) {
      objIndex = list.findIndex((obj => obj.name == name));
      guestsRef = firebase.database().ref("guestList/" + objIndex)
      guestsRef.update({
        Inside: "No",
        TimeOut: getTime(),
      })
      document.getElementById('checkOut').value = "";
      guestsRef.off();
      alerts(name, false)
    } 
  })
  }



//Placeholder to alert user when a succesful check in or check out function runs
  function alerts(name, Boolean){
    if(Boolean){
      console.log(name + " has been checked in!")
    }
    else{
      console.log(name + " has been checked out!")
    }
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


//------------------- UI List Funtions ------------------------

//Actively read data from firebase to print to UI
var ref = database.ref('guestList')
ref.on('value', gotData, errData);

function gotData(data){
  //Momentarily clears both UI lists so items can be added w/o duplicates
  document.getElementById("names").innerHTML = "";
  document.getElementById("namesInside").innerHTML = "";
  

  var scores = data.val();
  var keys = Object.keys(scores);

  var ul = document.getElementById("names");
  var ulInside = document.getElementById("namesInside");

  for ( var i=0; i < keys.length; i++){
    var k = keys[i];
    var names = scores[k].name;
    var inside = scores[k].Inside;

    var a =document.createElement("a");
    var li = document.createElement("li");

    a.textContent= names;
    li.appendChild(a);
    ul.appendChild(li);
    a.setAttribute('id', names);
    a.setAttribute('onclick', 'checkInn(id)');
  }
  for ( var i=0; i < keys.length; i++){
    var k = keys[i];
    var names = scores[k].name;
    var inside = scores[k].Inside;

    if(inside == "Yes"){
      var a = document.createElement("a");
      var li = document.createElement("li")

      a.textContent = names;
      li.appendChild(a);
      ulInside.appendChild(li);
      a.setAttribute('id', names);
      a.setAttribute('onclick', 'checkOutt(id)');
    }
    
  }
}

//Search List function
  function checkInList() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("checkIn");
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

function insideList() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("checkOut");
  filter = input.value.toUpperCase();
  ul = document.getElementById("namesInside");
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

