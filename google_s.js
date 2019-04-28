//promt sign in on laod is diabled
//window.onload = google_signin;
var allow = false;
var fireheading = document.getElementById("fireheading");
var isverified;
function google_signin() {
	var provider = new firebase.auth.GoogleAuthProvider();
	//provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
	console.log("here");
	firebase
		.auth()
		.signInWithPopup(provider)
		.then(function(result) {
			console.log("sucsess");
			//to stop onload instant access
			allow = true;

			if (result.credential) {
				// This gives you a Google Access Token. You can use it to access the Google API.
				var token = result.credential.accessToken;

				// ...
			}
			var user = firebase.auth().currentUser;
			console.log(user);
			console.log(user.displayName);
			//a global var bc otherwise it connot be read from other functions.
			window.name = user.displayName;
			isverified = user.emailVerified;
			var firebaseheadingref = firebase.database().ref().child("posts");
			firebaseheadingref.on("value", function(datasnapshot) {
				read(datasnapshot);
			});
		})
		.catch(function(error) {
			//a global var so other functions can acsess this
			allow = false;
			console.log("here");
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// The email of the user's account used.
			var email = error.email;
			// The firebase.auth.AuthCredential type that was used.
			var credential = error.credential;
			console.log(errorCode);
			// ...
		});
}
var description = document.getElementById("description");
var title = document.getElementById("title");
var submitbtn = document.getElementById("submit");

function submitclick() {
	//writing is not allowed when not verified
	if (allow && isverified) {
		//adding data
		var firebaseRef = firebase.database().ref().child("posts");
		var messagetext = description.value;
		var titletext = title.value;

		//making a new child everytime
		firebaseRef.push().set({
			name: window.name,
			title: titletext,
			desc: messagetext
		});

		//resseting the values
		//titletext = "";
	}
}
