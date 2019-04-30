var user_add = document.querySelector("#user_add");
var google_sign_in_button = document.querySelector("#google-sign-in");
function read(datasnapshot) {
	console.log("isverified: " + isverified);
	//reading is allowed when not verified
	if (allow) {
		var entries = Object.entries(datasnapshot.val());
		for (i = 0; i < entries.length; i++) {
			var current_entry = entries[i];

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
