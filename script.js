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

              //Uploads list to firebase realt time database
            } 
            fr.readAsText(this.files[0]);
            
        }) 


function strToObject()
{
  const guestList = [];

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

var ref = database.ref('guestList')
ref.on('value', gotData, errData);

function gotData(data){
  var scores = data.val();
  var keys = Object.keys(scores);

  var ul = document.getElementById("names");
  for ( var i=0; i < keys.length; i++){
    var k = keys[i];
    var names = scores[k].name;
    var inside = scores[k].Inside;

    var li = document.createElement('li');
    li.appendChild(document.createTextNode(names));
    ul.appendChild(li);


  }
}


function errData(err){
  console.log('Error!');
  console.log(err);
}



//clears guest list on screen
function printArray(list) {
  document.getElementById("names").innerHTML = "";
}







//Keeps local variable as current guest list
if(localStorage.getItem('guestlist') != null){
  guestList =  JSON.parse(localStorage.getItem('guestlist'));
}


      
function addItemToArray(){
 guestList.push(document.getElementById("txtMyText").value);
  localStorage.setItem('guestlist', JSON.stringify(guestList));
  //------------^store the item by stringify--^
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

//Check in
function checkIn() {
    //Grabs current guest to be added or deleted from form text box
    var name = document.getElementById('UsersName').value;
    
    //Checks to see if user is in list of guests and isn't in the list of guest in the party
    var ul = document.getElementById("names");
  
    //If not "inParty" and on guestList[], adds them to "inParty", else request rejected
      if (index != -1){
          firebase.database().ref('inParty/' + name ).set({
          TimeIn: getTime(),
        });
      alert(name + " has been checked in.")
      guestList.splice(index, 1);
      inParty.push(name);
      }
      else
      {
          alert("Sorry, " + name + " is not on the guest list")
      }
      
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
function guestsInside() {
  

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
    ul = document.getElementById("myUL");
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

