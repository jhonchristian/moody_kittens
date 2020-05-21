//#region 
let kitten_form 	 = document.getElementById("kitten-form");
let btn_free_kittens = document.getElementById("free-kittens");
let kitten_container = document.getElementById("kittens");
//#endregion

/**
 * Stores the list of kittens
 * @type {Kitten[]}
 */
let kittens = [];
/**
 * Called when submitting the new Kitten Form
 * This method will pull data from the form
 * use the provided function to give the data an id
 * you can use robohash for images
 * https://robohash.org/<INSERTCATNAMEHERE>?set=set4
 * then add that data to the kittens list.
 * Then reset the form
 */
function addKitten(event) {
	
	event.preventDefault();
	
	let form   = event.target;
	let name   = form.name.value;
	let kitten = {
					id       : generateId(),
					name     : name,
					mood     : "Tolerant",
					affection: 5
				}
	let kitten_exist = findKittenByName(name);
	if(!kitten_exist) {
		kittens.push(kitten);
		saveKittens();
	} else {
		alert("Kitten already Exist");
	}

	form.reset();
}

/**
 * Converts the kittens array to a JSON string then
 * Saves the string to localstorage at the key kittens
 */
function saveKittens() {
	window.localStorage.setItem("kittens", JSON.stringify(kittens));
	drawKittens();
}

/**
 * Attempts to retrieve the kittens string from localstorage
 * then parses the JSON string into an array. Finally sets
 * the kittens array to the retrieved array
 */
function loadKittens() {
	let data= JSON.parse(window.localStorage.getItem("kittens"));
	kittens = data ? data : [];

	if (kittens.length > 0) {
		btn_free_kittens.classList.remove("hidden");
		btn_free_kittens.innerText = "Set the "+kittens.length+" Kitten(s) Free";
	}
}

/**
 * Draw all of the kittens to the kittens element
 */
function drawKittens() {
	let template =	"";

	kittens.forEach(kitten => {
		if(kitten.affection !== 0) {
			template += `
						<div class="card bg-dark m-1 kitten ${kitten.mood ? kitten.mood : ""}">
							<img src="https://robohash.org/${kitten.name}?set=set4">
							<div class="text-light">
								<p>Name: ${kitten.name}</p>
								<p>Mood: ${kitten.mood}</p>
								<p>Affection: ${kitten.affection}</p>
							</div>
							<div class="d-flex space-around action-container">
								<button class="btn-cancel btn-action" onclick="pet('${kitten.id}')">Pet</button>
								<button class="btn-action" onclick="catnip('${kitten.id}')">Catnip</button>
							</div>
						</div>
					`;
		} else {
			template += `
							<div class="card bg-dark m-1 kitten ${kitten.mood ? kitten.mood : ""}">
								<img src="https://robohash.org/${kitten.name}?set=set4">
								<div class="text-danger text-center">
									<p>${kitten.name} run away.</p>
								</div>
							</div>
						`;
		}

		
	});

	kitten_container.innerHTML = template;
}

/**
 * Find the kitten in the array by its id
 * @param {string} id
 * @return {Kitten}
 */
function findKittenById(id) {
  return kittens.find(k => k.id == id);
}

/**
 * Find the kitten in the array by its name
 * @param {string} name
 * @return {Kitten}
 */
function findKittenByName(name) {
	return kittens.find(k => k.name === name);
}

/**
 * Find the kitten in the array of kittens
 * Generate a random Number
 * if the number is greater than .7
 * increase the kittens affection
 * otherwise decrease the affection
 * save the kittens
 * @param {string} id
 */
function pet(id) {

	let kitten = findKittenById(id);
	
	Math.random() > .7 
		? kitten.affection++
		: kitten.affection--;

	setKittenMood(kitten);
	saveKittens();
}

/**
 * Find the kitten in the array of kittens
 * Set the kitten's mood to tolerant
 * Set the kitten's affection to 5
 * save the kittens
 * @param {string} id
 */
function catnip(id) {
	let kitten           = findKittenById(id);
	    kitten.mood      = "tolerant";
		kitten.affection = 5;
	saveKittens();
}

/**
 * Sets the kittens mood based on its affection
 * Happy > 6, Tolerant <= 5, Angry <= 3, Gone <= 0
 * @param {Kitten} kitten
 */
function setKittenMood(kitten) {
	
	let affection = kitten.affection;

	affection <= 0
	? kitten.mood = "gone"
	: affection <= 3 
		? kitten.mood = "angry"
		: affection <= 5 
			? kitten.mood = "tolerant"
			: affection >= 6
				? kitten.mood = "happy" : "";
}

function getStarted() {
	document.getElementById("welcome").remove();
	kitten_form.classList.remove("hidden");
	drawKittens();
}

function freeKittens() {
	window.localStorage.removeItem("kittens");
	btn_free_kittens.classList.add("hidden");
	loadKittens();
}

/**
 * Defines the Properties of a Kitten
 * @typedef {{id: string, name: string, mood: string, affection: number}} Kitten
 */

/**
 * Used to generate a random string id for mocked
 * database generated Id
 * @returns {string}
 */
function generateId() {
  return (
    Math.floor(Math.random() * 10000000) +
    "-" +
    Math.floor(Math.random() * 10000000)
  );
}

loadKittens();