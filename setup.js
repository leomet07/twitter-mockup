var user_add = document.querySelector("#user_add");
var user_read = document.querySelector("#user_read");
var google_sign_in_button = document.querySelector("#google-sign-in");
//making the cirrent like key a global var
var key_of_current;

//making the cirrent slot a global var
var current_slot;

//making the username a global var
var current_user_name;
//makig entries a global var
var entries;
var count = 0;
function read(datasnapshot) {
	console.log("isverified: " + isverified);
	//reading is allowed when not verified
	if (allow) {
		entries = Object.entries(datasnapshot.val());
		for (i = 0; i < entries.length; i++) {
			var current_entry = entries[i];

			for (j = 0; j < current_entry.length; j++) {
				if (i == 0) {
					if (j != 0) {
						//bc first is wrong
						fireheading.innerHTML =
							"<li>" +
							JSON.stringify(current_entry[j]) +
							`<button class = 'followbutton' onclick = "follow(` +
							`'` +
							i.toString() +
							`'` +
							`)">Follow</button>` +
							`<button class = 'likebutton' onclick = "add(` +
							`'` +
							i.toString() +
							`'` +
							`)">Like</button>` +
							"</li>";
					}
				} else {
					if (j != 0) {
						fireheading.innerHTML +=
							"<li>" +
							JSON.stringify(current_entry[j]) +
							`<button class = 'followbutton' onclick = "follow(` +
							`'` +
							i.toString() +
							`'` +
							`)">Follow</button>` +
							`<button class = 'likebutton' onclick = "add(` +
							`'` +
							i.toString() +
							`'` +
							`)">Like</button>` +
							"</li>";
					}
				}
			}
		}

		if (!isverified) {
			console.log("here");
			user_add.style.display = "none";
			document.getElementById("verify").innerHTML =
				"You cannot 'tweet' until account is verified.Check your email.<br>After you verify your email,you must logout and re sign in.This is all extra security and for the greater good.";
		} else {
			user_add.style.display = "block";
		}
	}
}

function add(i) {
	//j is not needed since we willnever access anything other than index 1 of the nested list
	//getting like amount
	let current_likes = entries[i][1].likes.amount;
	//adding data only if it hasnt been liked before

	let current_users_liked = Object.entries(entries[i][1].likes.users);
	let has_liked = false;
	for (x = 0; x < current_users_liked.length; x++) {
		//only checkibg second slot bc only  uid is needed
		if (current_users_liked[x][1] == global_user.uid) {
			has_liked = true;
			current_slot = x;
			//has been liked before
		}
	}

	//if has not been liked oreviously
	if (!has_liked) {
		//current entry/post

		//increasing like amount
		current_likes++;
		key_of_current = firebase.database().ref().child("posts").child(entries[i][0]).child("likes").child("users").push().getKey();
		firebase.database().ref().child("posts").child(entries[i][0]).child("likes").child("users").child(key_of_current).set(global_user.uid);
		firebase.database().ref().child("posts").child(entries[i][0]).child("likes").child("amount").set(current_likes);
	} else if (has_liked) {
		current_likes = current_likes - 1;
		//.removeValue();
		console.log(key_of_current);
		if (key_of_current === undefined) {
			key_of_current = current_users_liked[current_slot][0];
			//liked before page is loaded
			//means like must be retrieved in a different way
		}
		firebase.database().ref().child("posts").child(entries[i][0]).child("likes").child("users").child(key_of_current).remove();
		firebase.database().ref().child("posts").child(entries[i][0]).child("likes").child("amount").set(current_likes);
	}
}

//submit btn
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

		//since writing is only when u r signed in,you can use the uid to access the username
		function getusername() {}

		console.log("here");
		//making a new child everytime
		firebaseRef.push().set({
			user_name: current_user_name,
			name: global_user.displayName,
			title: titletext,
			desc: messagetext,
			uid: global_user.uid,
			likes: { amount: 0, users: { placeholder: "placeholderid" } }
		});

		document.getElementById("title").value = "";
		document.getElementById("description").value = "";
		//uid is posted to add user link

		//resseting the values
		//titletext = "";
	}
}

window.onkeyup = async function(e) {
	//username availibilty checker
	//let used so it cannt be acceswd in anyother part

	let username_form = document.getElementById("signup-username");

	let user_name_value = username_form.value;
	//console.log(user_name_value);
	//access a seaperate main child with only usernames for fasetr querings
	let firebaseheadingref = firebase.database().ref().child("usernames");

	await firebaseheadingref.on("value", function(datasnapshot) {
		//console.log("here");
		//console.log(datasnapshot.val());
		let the_usernames = Object.entries(datasnapshot.val());
		//console.log(the_usernames);
		let has_been_used = false;
		for (i = 0; i < the_usernames.length; i++) {
			if (user_name_value == the_usernames[i][1]) {
				has_been_used = true;
			}
		}
		let status_pharagraph_query = document.querySelector("#status");
		if (!has_been_used) {
			//has not been used
			document.getElementById("status").innerHTML = "@" + user_name_value + " is avalible";
			status_pharagraph_query.style.color = "green";
		} else if (has_been_used) {
			document.getElementById("status").innerHTML = "@" + user_name_value + " is not avalible";
			status_pharagraph_query.style.color = "red";
			//has been used
		}
	});
};

function follow(i) {
	var firebaseheadingref = firebase.database().ref().child("users");
	let current_followers;
	let current_followers_amount;
	let other_users_follower_amount;
	let other_current_followers;
	let other_uid;
	let current_slot;
	let snapshot;
	firebaseheadingref.on("value", function(datasnapshot) {
		//console.log(datasnapshot.val());
		snapshot = datasnapshot.val();
		//listener is separate so it doesnt affect anything else
	});
	//other persons uid
	other_uid = entries[i][1].uid;
	//console.log(other_uid);

	//current_users_followers
	//console.log(snapshot);
	//current_followers_amount = snapshot[global_user.uid].follow.followers.amount;
	//current_followers = Object.entries(snapshot[global_user.uid].follow.followers.follow_users);

	other_users_follower_amount = snapshot[other_uid].follow.followers.amount;
	other_current_followers = Object.entries(snapshot[other_uid].follow.followers.follow_users);
	console.log(other_users_follower_amount);
	let has_been_followed = false;

	for (j = 0; j < other_current_followers.length; j++) {
		//console.log(other_current_followers[j][1]);
		if (global_user.uid == other_current_followers[j][1]) {
			console.log("comparsion successful");
			current_slot = j;
			has_been_followed = true;
		}
	}

	console.log(has_been_followed);

	if (!has_been_followed) {
		//current entry/post

		//increasing like amount
		console.log("ebfore" + other_users_follower_amount);
		other_users_follower_amount = Number(other_users_follower_amount) + 1;
		console.log(other_users_follower_amount);
		//console.log(other_uid);
		firebase.database().ref().child("users").child(other_uid).child("follow").child("followers").child("amount").set(other_users_follower_amount);
		key_of_current = firebase.database().ref().child("posts").child(other_uid).child("likes").child("users").push().getKey();
		firebase.database().ref().child("users").child(other_uid).child("follow").child("followers").child("follow_users").child(key_of_current).set(global_user.uid);

		console.log("completed");
	} else if (has_been_followed) {
		console.log("here");
		console.log(other_users_follower_amount);
		other_users_follower_amount = Number(other_users_follower_amount) - 1;
		console.log(other_users_follower_amount);
		//.removeValue();
		//console.log(key_of_current);
		if (key_of_current === undefined) {
			key_of_current = other_current_followers[current_slot][0];
			//liked before page is loaded
			//means like must be retrieved in a different way
		}
		//comes before
		firebase.database().ref().child("users").child(other_uid).child("follow").child("followers").child("amount").set(other_users_follower_amount);
		firebase.database().ref().child("users").child(other_uid).child("follow").child("followers").child("follow_users").child(key_of_current).remove();

		console.log("retirn");
	}
}

function login() {}

//the two buttons shown on page load
var loginbtn = document.querySelector("#togglelogin");
var signupbtn = document.querySelector("#tooglesignup");
window.onload = function() {
	//only adds functionality when window is fully loaded,otherwise it wont recognize the elements
	var acc = document.getElementsByClassName("accordion");
	console.log(acc);
	for (var i = 0; i < acc.length; i++) {
		acc[i].addEventListener("click", function() {
			//this = current button
			this.classList.toggle("active");

			//only toggles the div that is right after the button,so include everythingin 1 div(div has to be right after button in html)
			var panel = this.nextElementSibling;
			if (panel.style.display === "block") {
				panel.style.display = "none";
			} else {
				panel.style.display = "block";
			}

			//once cllicked/selected remove option/other button
			if (this.id == "togglelogin") {
				//if paneil is shown AFTER click remove other btns
				if (panel.style.display == "block") {
					//remove other btns
					signupbtn.style.display = "none";
				} else if (panel.style.display == "none") {
					//show other btns
					signupbtn.style.display = "block";
				}
			} else if (this.id == "tooglesignup") {
				//if paneil is shown AFTER click remove other btns
				if (panel.style.display == "block") {
					//remove other btns
					loginbtn.style.display = "none";
				} else if (panel.style.display == "none") {
					//show other btns
					loginbtn.style.display = "block";
				}
			}
		});
	}
};
