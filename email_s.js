// DOM elements
const guideList = document.querySelector(".guides");
const onsignupflexer = document.querySelector("#onsignup");
const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");

const accountDetails = document.querySelector(".account-details");
const setupUI = (user) => {
	if (user) {
		// account info
		const html = `
        <div>Logged in as ${user.email}</div>
      `;
		accountDetails.innerHTML = html;
		// toggle user UI elements
		loggedInLinks.forEach((item) => (item.style.display = "block"));
		loggedOutLinks.forEach((item) => (item.style.display = "none"));
		onsignupflexer.style.display = "none";
	} else {
		// clear account info
		accountDetails.innerHTML = "";
		// toggle user elements
		loggedInLinks.forEach((item) => (item.style.display = "none"));
		loggedOutLinks.forEach((item) => (item.style.display = "block"));
		onsignupflexer.style.display = "block";
	}
};

// signup
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", function(e) {
	//stop reloadings
	e.preventDefault();

	//if acct is made and is signed in then remove option sto sign in with google.SO you would have to sign out.
	google_sign_in_button.style.display = "none";

	// get user info
	const email = signupForm["signup-email"].value;
	const password = signupForm["signup-password"].value;
	const username = signupForm["signup-username"].value;

	//console.log("jd");
	console.log(username);

	console.log(email, password);

	// sign up the user
	auth.createUserWithEmailAndPassword(email, password).then((cred) => {
		console.log("sending verification");
		firebase.auth().currentUser.sendEmailVerification();
		document.getElementById("verify").innerHTML =
			"You cannot work until account is verified.Check your email.<br>.After you verify your email,you must logout and re sign in.This is all extra security and for the greater good.";
		//ueser data = auth
		console.log(firebase.auth().currentUser);
		global_user = firebase.auth().currentUser;
		current_user_name = username;
		current_user_name = current_user_name.toLowerCase();
		allow = true;
		isverified = cred.user.emailVerified;

		var firebaseheadingref = firebase.database().ref().child("posts");
		firebaseheadingref.on("value", function(datasnapshot) {
			console.log("her1e");
			read(datasnapshot);
		});
		//adding the user to the database
		console.log(username);
		//adding a username to a seperate child for faster comparisin times
		firebase.database().ref().child("usernames").child(global_user.uid).set(username);
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

		// close the signup modal & reset form
		const modal = document.querySelector("#modal-signup");

		signupForm.reset();
	});
});

function reset() {
	fireheading.innerHTML = "";
}
//signout
// logout
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
	e.preventDefault();
	auth.signOut().then(() => {
		//making verif not seen
		document.getElementById("verify").innerHTML = null;

		//temoving user add
		user_add.style.display = "none";
		//console.log("user signed out");
	});
});
function getusername() {
	//getting the username
	firebase.database().ref().child("users").on("value", function(datasnapshot) {
		current_user_name = datasnapshot.val();
		current_user_name = current_user_name[global_user.uid].user_name;
		console.log(current_user_name);
	});
}

// login
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e) => {
	e.preventDefault();

	// get user info
	const email = loginForm["login-email"].value;
	const password = loginForm["login-password"].value;

	// log the user in
	auth.signInWithEmailAndPassword(email, password).then((cred) => {
		//when successful close option for google sign in
		//if signed in with email/passowrd then remove option to sign in with google.SO you would have to sign out.
		google_sign_in_button.style.display = "none";

		console.log("signed in with email and password");
		global_user = firebase.auth().currentUser;

		getusername();
		isverified = cred.user.emailVerified;
		// close the signup modal & reset form

		const modal = document.querySelector("#modal-login");
		//if not verified

		if (cred.user.emailVerified == false) {
			document.getElementById("verify").innerHTML =
				"You cannot 'tweet' until account is verified.Check your email.<br>After you verify your email,you must logout and re sign in.This is all extra security and for the greater good.";
			isverified = false;
			console.log("verify pls");
			firebase.auth().currentUser.sendEmailVerification();
		}

		loginForm.reset();
	});
});

// listen for auth status changes
auth.onAuthStateChanged((user) => {
	if (user) {
		//adding user read
		user_read.style.display = "block";
		setupUI(user);
		global_user = firebase.auth().currentUser;
		getusername();
		//if signed in then remove option to sign in with google again.SO you would have to sign out.
		google_sign_in_button.style.display = "none";
		console.log("user logged in: ");
		allow = true;
		console.log(global_user);
		isverified = user.emailVerified;
		var firebaseheadingref = firebase.database().ref().child("posts");
		firebaseheadingref.on("value", function(datasnapshot) {
			read(datasnapshot);
		});

		//make login and signupnforms not seen
	} else {
		//making verif not seen
		document.getElementById("verify").innerHTML = null;

		//temoving user add
		user_add.style.display = "none";

		//removing user read
		user_read.style.display = "none";

		//showing google sign in as a option
		google_sign_in_button.style.display = "block";

		//console.log("user signed out");
		setupUI();
		console.log("user logged out");
	}
});

function resetpassword() {
	console.log("passwrod");
	let email = loginForm["login-email"].value;
	console.log(email);
	auth
		.sendPasswordResetEmail(email)
		.then(function() {
			// Email sent.
			console.log("Email Sent");
		})
		.catch(function(error) {
			// An error happened.
		});
}
