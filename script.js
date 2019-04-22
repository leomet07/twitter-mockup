var maintext = document.getElementById('maintext');
var submitbtn = document.getElementById('submit');

var fireheading = document.getElementById('fireheading');
var firebaseheadingref = firebase.database().ref().child('Heading');
firebaseheadingref.on('value', function(datasnapshot) {
	console.log(JSON.stringify(datasnapshot));

	//to loop through nested
	var entries = Object.entries(datasnapshot.val());
	console.log(entries);
	for (i = 0; i < entries.length; i++) {
		console.log(entries[i]);
	}
	fireheading.innerText = JSON.stringify(datasnapshot.val());
});

function submitclick() {
	//adding data
	var firebaseRef = firebase.database().ref();
	var messagetext = maintext.value;
	//for replacing a child
	//firebaseRef.child('Text').set(messagetext);

	//making a new child everytime
	firebaseRef.push().set(messagetext);

	//retreiving data
}
