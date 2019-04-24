window.onload = google_signin;
var allow = false;
var fireheading = document.getElementById("fireheading");


function google_signin() {
	var provider = new firebase.auth.GoogleAuthProvider();
	//provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
	console.log("here")
	firebase.auth().signInWithPopup(provider).then(function (result) {
		console.log("sucsess")
		//to stop onload instant access 
		allow = true;

		if (result.credential) {
			// This gives you a Google Access Token. You can use it to access the Google API.
			var token = result.credential.accessToken;

			// ...
		}
		var user = firebase.auth().currentUser;
		console.log(user)
		console.log(user.displayName)
		//a global var bc otherwise it connot be read from other functions.
		window.name = user.displayName;

		if (allow) {
			var firebaseheadingref = firebase.database().ref().child("posts");
			firebaseheadingref.on("value", function (datasnapshot) {
				read(datasnapshot)
			});

		}


	}).catch(function (error) {

		//a global var so other functions can acsess this
		allow = false;
		console.log("here")
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// The email of the user's account used.
		var email = error.email;
		// The firebase.auth.AuthCredential type that was used.
		var credential = error.credential;
		console.log(errorCode)
		// ...
	});

}
var description = document.getElementById("description");
var title = document.getElementById("title");
var submitbtn = document.getElementById("submit");

function read(datasnapshot) {
	if (allow) {
		var entries = Object.entries(datasnapshot.val());
		console.log(JSON.stringify(datasnapshot.val()))
		for (i = 0; i < entries.length; i++) {
			console.log("here")
			var current_entry = entries[i];
			console.log(current_entry)
			for (j = 0; j < current_entry.length; j++) {
				if (i == 0) {
					if (j != 0) {
						fireheading.innerHTML = JSON.stringify(current_entry[j]) + "<br>";

					}

				} else {
					if (j != 0) {
						fireheading.innerHTML += JSON.stringify(current_entry[j]) + "<br>";

					}

				}
			}

		}


	}

}
function submitclick() {
	if (allow) {
		//adding data
		var firebaseRef = firebase.database().ref().child("posts");
		var messagetext = description.value;
		var titletext = title.value;


		//making a new child everytime
		firebaseRef.push().set(
			{
				'name': window.name,
				'title': titletext,
				'desc': messagetext
			}
		);

	}
}
