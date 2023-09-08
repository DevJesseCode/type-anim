/**
 * Creates an event emitter that lets you execute preset callbacks based on specified events.
 *
 * @constructor Creates a `Map` to handle events data.
 */
class EventEmmitter {
	constructor() {
		this.events = new Map();
	}
	/**
	 * Adds an event-callback pair to the events map
	 *
	 * @param {any} event The event to watch for
	 * @param {Function} callback The callback to be executed when the event is emitted
	 */
	on(event, callback) {
		this.events.set(event, callback);
	}
	/**
	 * Executes the callback associated with the event passed to the function.
	 *
	 * @param {any} event The event whose callback should be executed
	 */
	emit(event) {
		this.events.get(event)();
	}
	/**
	 * Checks if an event exists in the events map
	 *
	 * @param {any} event The event to check for
	 * @returns {Boolean} `true` if the event exists in the event map and `false` otherwise
	 */
	awaits(event) {
		if (this.events.get(event)) return true;
		return false;
	}
}
const typingEmmitter = new EventEmmitter();

/**
 * Types a string into an element that can display text.
 *
 * @param {String} what Text to be typed into the text container
 * @param {Element} where Element to type the text passed as `what` into
 * @param {String} emitOnComplete Typing event to emit when typing is complete
 * @returns {Promise} A promise or throws an `Error`
 */
const type = (what, where, emitOnComplete) => {
	return new Promise((resolve, reject) => {
		const span = document.createElement("span");
		if (!where) {
			where = document.querySelector(".type-inside");
			if (!where) {
				reject("Could not find suitable typing container.");
				throw new Error(
					"Could not find suitable typing container.\nPlease pass an element that can contain text as the second argument."
				);
			}
		}
		if (where.idle_blink) {
			clearInterval(where.idle_blink);
		}
		if (where.typing) {
			clearTimeout(where.typing);
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
			try {
				where.removeChild(where.firstElementChild);
			} catch (error) {
				errors.push(error);
			}
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
			let charactersTyped = 0;

			for (let i = 0; i < what.length; i++) {
				where.typing = setTimeout(() => {
					try {
						where.removeChild(span);
						where.innerHTML += what[i];
						where.appendChild(span);
					} catch (error) {
						errors.push(error);
					}

					charactersTyped++;

					if (charactersTyped === what.length) {
						if (
							emitOnComplete &&
							typingEmmitter.awaits(emitOnComplete)
						) {
							typingEmmitter.emit(emitOnComplete);
						}
						resolve();
					}
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
	});
};

document.addEventListener("keydown", (event) => {
	switch (event.key) {
		case "1":
			type("This text will resolve a promise🤝").then(() => {
				console.log("Done typing one!");
			});
			break;
		case "2":
			type("This second text will resolve a promise🤝").then(() => {
				console.log("Done typing two!");
			});
			break;
		case "3":
			type("This third text will also resolve a promise🤝😊").then(() => {
				console.log("Done typing three!");
			});
			break;
		case "4":
			type("I emit an event when completely typed⌨", null, "test");
			break;
		case "5":
			type("I also emit an event when completely typed⌨", null, "test");
			break;
		case "6":
			type(
				"I am the last one to emit an event when completely typed⌨😊",
				null,
				"test"
			);
			break;
	}
});

const errors = [];
typingEmmitter.on("test", () => {
	console.log("A log from the typing emitter");
});
