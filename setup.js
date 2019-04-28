var user_add = document.querySelector("#user_add");
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
			document.getElementById("verify").innerHTML = "We have let you read this twitter.You cannot write until you verify your email account.verify pls";
		} else {
			user_add.style.display = "block";
		}
	}
}
