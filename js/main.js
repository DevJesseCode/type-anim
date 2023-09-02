/**
 * Types a string into an element that can display text.
 *
 * @param {string} what Text to be typed into the text container
 * @param {string} where Element to type the text passed as `what` into
 * @returns {promise} A promise or throws an `Error`
 */
const type = (what, where) => {
	const span = document.createElement("span");
	if (!where) {
		where = document.querySelector(".type-inside");
		if (!where) {
			throw new Error(
				"Could not find suitable typing container.\nPlease pass an element that contain text as the second argument."
			);
		}
	}
	if (where.idle_blink) {
		clearInterval(where.idle_blink);
	}
	const start_blinking = () => {
		span.textContent = "_";
		where.appendChild(span);
		let blink_count = 0;
		const blink_fx = setInterval(() => {
			if (span.style.color !== "black") {
				span.style.color = "black";
			} else {
				span.style.color = "transparent";
			}
			if (blink_count + 1 === 11) {
				clearInterval(blink_fx);
				start_typing(span);
			}
			blink_count++;
		}, 300);
	};

	const prev_length = where.textContent.length;
	if (prev_length !== 0) {
		where.removeChild(where.firstElementChild);
		for (let i = 0; i < prev_length; i++) {
			setTimeout(() => {
				where.innerHTML = where.innerHTML.slice(0, -2);
				where.innerHTML += "_";
				if (i === prev_length - 1) {
					where.innerHTML = "";
					start_blinking();
				}
			}, 100 * i);
		}
	} else {
		start_blinking();
	}

	const start_typing = () => {
		for (let i = 0; i < what.length; i++) {
			setTimeout(() => {
				where.removeChild(span);
				where.innerHTML += what[i];
				where.appendChild(span);
			}, 150 * i);
		}
		where.idle_blink = setInterval(() => {
			if (span.style.color !== "black") {
				span.style.color = "black";
			} else {
				span.style.color = "transparent";
			}
		}, 300);
	};
	return true;
};

document.addEventListener("keydown", (event) => {
	switch (event.key) {
		case "1":
			type("Hello, how are you doing today?");
			break;
		case "2":
			type("I hope that all is well.");
			break;
		case "3":
			type("Are you feeling better? You seemed sad last time we spoke.");
			break;
	}
});
