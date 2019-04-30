// setup materialize components
document.addEventListener("DOMContentLoaded", function() {
	var modals = document.querySelectorAll(".modal");
	M.Modal.init(modals);

	var items = document.querySelectorAll(".collapsible");
	M.Collapsible.init(items);
});

// DOM elements
const guideList = document.querySelector(".guides");
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
	} else {
		// clear account info
		accountDetails.innerHTML = "";
		// toggle user elements
		loggedInLinks.forEach((item) => (item.style.display = "none"));
		loggedOutLinks.forEach((item) => (item.style.display = "block"));
	}
};

// signup
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", (e) => {
	//stop reloadings
	e.preventDefault();

	//if acct is made and is signed in then remove option sto sign in with google.SO you would have to sign out.
	google_sign_in_button.style.display = "none";

	// get user info
	const email = signupForm["signup-email"].value;
	const password = signupForm["signup-password"].value;
	console.log(email, password);
	document.getElementById("verify").innerHTML =
		"You cannot work until account is verified.Check your email.<br>.After you verify your email,you must logout and re sign in.This is all extra security and for the greater good.";

	// sign up the user
	auth.createUserWithEmailAndPassword(email, password).then((cred) => {
		console.log("sending verification");
		firebase.auth().currentUser.sendEmailVerification();
		//ueser data = auth
		console.log(cred.user);
		allow = true;
		isverified = cred.user.emailVerified;

		var firebaseheadingref = firebase.database().ref().child("posts");
		firebaseheadingref.on("value", function(datasnapshot) {
			console.log("her1e");
			read(datasnapshot);
		});
		// close the signup modal & reset form
		const modal = document.querySelector("#modal-signup");
		M.Modal.getInstance(modal).close();
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

//login
// login
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e) => {
	e.preventDefault();

	//if signed in with email/passowrd then remove option to sign in with google.SO you would have to sign out.
	google_sign_in_button.style.display = "none";
	// get user info
	const email = loginForm["login-email"].value;
	const password = loginForm["login-password"].value;

	// log the user in
	auth.signInWithEmailAndPassword(email, password).then((cred) => {
		console.log("signed in");
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
		//togalle
		M.Modal.getInstance(modal).close();
		loginForm.reset();
	});
});

// listen for auth status changes
auth.onAuthStateChanged((user) => {
	if (user) {
		setupUI(user);
		//if signed in then remove option to sign in with google again.SO you would have to sign out.
		google_sign_in_button.style.display = "none";
		console.log("user logged in: ");
		allow = true;
		isverified = user.emailVerified;
		var firebaseheadingref = firebase.database().ref().child("posts");
		firebaseheadingref.on("value", function(datasnapshot) {
			read(datasnapshot);
		});
	} else {
		//making verif not seen
		document.getElementById("verify").innerHTML = null;

		//temoving user add
		user_add.style.display = "none";

		//showing google sign in as a option
		google_sign_in_button.style.display = "block";

		//console.log("user signed out");
		setupUI();
		console.log("user logged out");
		reset();
	}
});
