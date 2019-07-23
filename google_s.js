//promt sign in on laod is diabled
//window.onload = google_signin;
var allow = false;
var fireheading = document.getElementById("fireheading");
var isverified;

//making current user global
var global_user;
var checksnapshot;

function google_signin() {
	var provider = new firebase.auth.GoogleAuthProvider();
	//provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
	console.log("here");
	firebase
		.auth()
		.signInWithPopup(provider)
		.then(function(result) {
			//if signed in with google then remove option to sign in with google again.SO you would have to sign out.
			google_sign_in_button.style.display = "none";
			console.log("sucsess");
			//to stop onload instant access
			allow = true;

			if (result.credential) {
				// This gives you a Google Access Token. You can use it to access the Google API.
				var token = result.credential.accessToken;

				// ...
			}

			var user = firebase.auth().currentUser;
			global_user = user;
			console.log(user);

			//mmaking google users have a email as their username
			current_user_name = user.email;
			//adding a username to userlist
			console.log("hi");
			checksnapshot = "hi";
			var firebaseheadingref = firebase.database().ref().child("users");
			firebaseheadingref.on("value", function(datasnapshot) {
				checksnapshot = datasnapshot.val();
				console.log(checksnapshot);
			});
			//making a new user everytime
			if (checksnapshot[global_user.uid] == null) {
				console.log("add");
				firebase.database().ref().child("users").child(global_user.uid).set({
					user_name: current_user_name,
					follow: { followers: { amount: 0, follow_users: { placeholder: "placeholder" } }, following: { amount: 0, follow_users: { placeholder: "placeholder" } } }
				});
			}

			//adding email to separate email collection
			firebase.database().ref().child("usernames").child(global_user.uid).set(current_user_name);

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
