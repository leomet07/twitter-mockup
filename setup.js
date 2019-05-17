var user_add = document.querySelector("#user_add");
var user_read = document.querySelector("#user_read");
var google_sign_in_button = document.querySelector("#google-sign-in");
//making the cirrent like key a global var
var key_of_current_for_followers;

 //making the cirrent slot a global var
var current_slot_for_followers;

 //making the username a global var
var current_user_name;
//makig entries a global var
var entries;
var count = 0;
var tweet_container = document.getElementById("tweet_container");
function read(datasnapshot) {
	console.log("isverified: " + isverified);
	//reading is allowed when not verified
	if (allow) {
		entries = Object.entries(datasnapshot.val());
		for (i = 0; i < entries.length; i++) {
			var current_entry = entries[i];

 			for (j = 0; j < current_entry.length; j++) {
				let tweettobedisplayed = current_entry[j];

 				if (i == 0) {
					console.log("here");

 					if (j != 0) {
						tweet_container.innerHTML =
							`<div class = "tweet">` +
							`<p class = "username">@` +
							tweettobedisplayed.user_name +
							`</p>` +
							`<p class = "title">` +
							tweettobedisplayed.title +
							`</p>` +
							`<p class = "desc">` +
							tweettobedisplayed.desc +
							`</p>` +
							`<p class = "likes">Likes:` +
							tweettobedisplayed.likes.amount +
							`</p>` +
							`<p class = "followers_amount">Followers:` +
							snapshot[tweettobedisplayed.uid].follow.followers.amount +
							`</p>` +
							`<p class = "followers_amount">Following:` +
							snapshot[tweettobedisplayed.uid].follow.following.amount +
							`</p>` +
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
							`</div>`;
					}
				} else if (i != 0) {
					if (j != 0) {
						if (j != 0) {
							console.log(snapshot[tweettobedisplayed.uid].follow.following.amount);
							tweet_container.innerHTML +=
								`<div class = "tweet">` +
								`<p class = "username">@` +
								tweettobedisplayed.user_name +
								`</p>` +
								`<p class = "title">` +
								tweettobedisplayed.title +
								`</p>` +
								`<p class = "desc">` +
								tweettobedisplayed.desc +
								`</p>` +
								`<p class = "likes">Likes:` +
								tweettobedisplayed.likes.amount +
								`</p>` +
								`<p class = "followers_amount">Followers:` +
								snapshot[tweettobedisplayed.uid].follow.followers.amount +
								`</p>` +
								`<p class = "followers_amount">Following:` +
								snapshot[tweettobedisplayed.uid].follow.following.amount +
								`</p>` +
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
								`</div>`;
						}
					}
				}
			}
		}
		console.log("hereremove here");
		if (!isverified) {
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
			current_slot_for_followers = x;
			//has been liked before
		}
	}

 	//if has not been liked oreviously
	if (!has_liked) {
		//current entry/post

 		//increasing like amount
		current_likes++;
		key_of_current_for_followers = firebase.database().ref().child("posts").child(entries[i][0]).child("likes").child("users").push().getKey();
		firebase.database().ref().child("posts").child(entries[i][0]).child("likes").child("users").child(key_of_current_for_followers).set(global_user.uid);
		firebase.database().ref().child("posts").child(entries[i][0]).child("likes").child("amount").set(current_likes);
	} else if (has_liked) {
		current_likes = current_likes - 1;
		//.removeValue();
		console.log(key_of_current_for_followers);
		if (key_of_current_for_followers === undefined) {
			key_of_current_for_followers = current_users_liked[current_slot_for_followers][0];
			//liked before page is loaded
			//means like must be retrieved in a different way
		}
		firebase.database().ref().child("posts").child(entries[i][0]).child("likes").child("users").child(key_of_current_for_followers).remove();
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

 		//making a new child everytime
		if (messagetext != "" && titletext != "") {
			console.log("here");
			firebaseRef.push().set({
				user_name: current_user_name,
				name: global_user.displayName,
				title: titletext,
				desc: messagetext,
				uid: global_user.uid,
				likes: { amount: 0, users: { placeholder: "placeholderid" } }
			});
		}

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
var snapshot;
firebase.database().ref().child("users").on("value", function(datasnapshot) {
	//console.log(datasnapshot.val());
	snapshot = datasnapshot.val();
	console.log(snapshot);
	//listener is separate so it doesnt affect anything else
});
function follow(i) {
	var firebaseheadingref = firebase.database().ref().child("users");
	let current_followers;
	let current_followers_amount;
	let other_users_follower_amount;
	let other_current_followers;
	let other_uid;
	let current_slot_for_followers;
	let current_slot_for_following;
	let key_of_current_for_following;

 	//other persons uid
	other_uid = entries[i][1].uid;
	//console.log(other_uid);

 	//current_users_followers
	//console.log(snapshot);
	//current_followers_amount = snapshot[global_user.uid].follow.followers.amount;
	//current_followers = Object.entries(snapshot[global_user.uid].follow.followers.follow_users);

 	other_users_follower_amount = snapshot[other_uid].follow.followers.amount;
	other_current_followers = Object.entries(snapshot[other_uid].follow.followers.follow_users);
	other_users_following_amount = snapshot[global_user.uid].follow.following.amount;
	other_current_following = Object.entries(snapshot[global_user.uid].follow.following.follow_users);
	console.log(other_current_following);
	//once data has been recieved turn listener off
	firebase.database().ref().child("users").off();
	let has_been_followed = false;

 	for (let j = 0; j < other_current_followers.length; j++) {
		//console.log(other_current_followers[j][1]);
		if (global_user.uid == other_current_followers[j][1]) {
			console.log("comparsion successful");
			current_slot_for_followers = j;
			has_been_followed = true;
		}
	}

 	//second for loop only for current slot since follow status has already been determined
	for (let z = 0; z < other_current_following.length; z++) {
		console.log(other_current_following[z][1]);
		if (other_uid == other_current_following[z][1]) {
			console.log("comparsion successful 3");
			current_slot_for_following = z;
		}
	}

 	if (!has_been_followed) {
		//current entry/post

 		//increasing like amount

 		other_users_follower_amount = Number(other_users_follower_amount) + 1;
		other_users_following_amount = Number(other_users_following_amount) + 1;

 		//console.log(other_uid);
		firebase.database().ref().child("users").child(other_uid).child("follow").child("followers").child("amount").set(other_users_follower_amount);
		firebase.database().ref().child("users").child(global_user.uid).child("follow").child("following").child("amount").set(other_users_following_amount);

 		key_of_current_for_followers = firebase.database().ref().child("users").child(other_uid).child("likes").child("users").push().getKey();
		firebase.database().ref().child("users").child(other_uid).child("follow").child("followers").child("follow_users").child(key_of_current_for_followers).set(global_user.uid);

 		key_of_current_for_following = firebase.database().ref().child("users").child(global_user.uid).child("likes").child("users").push().getKey();
		firebase.database().ref().child("users").child(global_user.uid).child("follow").child("following").child("follow_users").child(key_of_current_for_followers).set(other_uid);

 		console.log("follow completed");
	} else if (has_been_followed) {
		other_users_follower_amount = Number(other_users_follower_amount) - 1;
		other_users_following_amount = Number(other_users_following_amount) - 1;
		//console.log(other_users_follower_amount, other_users_following_amount);
		//.removeValue();
		//console.log(key_of_current_for_followers);
		if (key_of_current_for_followers === undefined) {
			key_of_current_for_followers = other_current_followers[current_slot_for_followers][0];
			//liked before page is loaded
			//means like must be retrieved in a different way
		}

 		if (key_of_current_for_following === undefined) {
			console.log(other_current_following);

 			key_of_current_for_following = other_current_following[current_slot_for_following][0];
			console.log(key_of_current_for_following);
			//liked before page is loaded
			//means like must be retrieved in a different way
		}
		//comes before
		firebase.database().ref().child("users").child(global_user.uid).child("follow").child("following").child("amount").set(other_users_following_amount);
		firebase.database().ref().child("users").child(other_uid).child("follow").child("followers").child("amount").set(other_users_follower_amount);
		firebase.database().ref().child("users").child(other_uid).child("follow").child("followers").child("follow_users").child(key_of_current_for_followers).remove();

 		firebase.database().ref().child("users").child(global_user.uid).child("follow").child("following").child("follow_users").child(key_of_current_for_following).remove();
		console.log("unfollow completed");
	}
	//once is used to not make another event lister
	firebase.database().ref().child("posts").on("value", function(datasnapshot) {
		read(datasnapshot);
		//listener is separate so it doesnt affect anything else
	});

 	firebase.database().ref().child("users").on("value", function(datasnapshot) {
		//console.log(datasnapshot.val());
		snapshot = datasnapshot.val();
		//console.log(snapshot);
		//listener is separate so it doesnt affect anything else
	});
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
