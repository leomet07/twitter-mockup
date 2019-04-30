var user_add = document.querySelector("#user_add");
var google_sign_in_button = document.querySelector("#google-sign-in");

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
						fireheading.innerHTML = "<li>" + JSON.stringify(current_entry[j]) + `<button class = 'sbutton' onclick = "add(` + `'` + i.toString() + `'` + `)">Like</button>` + "</li>";
					}
				} else {
					if (j != 0) {
						fireheading.innerHTML += "<li>" + JSON.stringify(current_entry[j]) + `<button class = 'sbutton' onclick = "add(` + `'` + i.toString() + `'` + `)">Like</button>` + "</li>";
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

	count++;

	//current entry/post

	//getting like amount
	let current_likes = entries[i][1].likes.amount;

	//increasing like amount
	current_likes++;

	//adding data only if it hasnt been liked before
	//object.values is used bc we need only the uid
	let current_users_liked = Object.values(entries[i][1].likes.users);
	let has_liked = false;
	for (x = 0; x < current_users_liked.length; x++) {
		if (current_users_liked[x] == global_user.uid) {
			has_liked = true;
			//has been liked before
		}
	}

	//if has not been liked oreviously
	if (!has_liked) {
		firebase.database().ref().child("posts").child(entries[i][0]).child("likes").child("users").push().set(global_user.uid);
		firebase.database().ref().child("posts").child(entries[i][0]).child("likes").child("amount").set(current_likes);
	}
}
