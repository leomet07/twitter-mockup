var description = document.getElementById('description');
var title = document.getElementById('title');
var submitbtn = document.getElementById('submit');

var fireheading = document.getElementById('fireheading');
var firebaseheadingref = firebase.database().ref().child('posts');
firebaseheadingref.on('value', function(datasnapshot) {
	//to loop through nested
	var entries = Object.entries(datasnapshot.val());

	for (i = 0; i < entries.length; i++) {
		console.log(entries[i]);
		if (i == 0) {
			fireheading.innerHTML = entries[i] + '<br>';
		} else {
			fireheading.innerHTML += entries[i] + '<br>';
		}
	}
	//fireheading.innerText = JSON.stringify(datasnapshot.val());
});

function submitclick() {
	//adding data
	var firebaseRef = firebase.database().ref().child('posts');
	var messagetext = description.value;
	var titletext = title.value;
	//for replacing a child
	//firebaseRef.child('Text').set(messagetext);

	//making a new child everytime
	firebaseRef.child(titletext).set(messagetext);

	//firebaseRef.child('Text').set(messagetext);

	//retreiving data
}
