import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
	return new Promise(function (_, reject) {
		setTimeout(function () {
			reject(
				new Error(`Request took too long! Timeout after ${s} second`)
			);
		}, s * 1000);
	});
};

export const getJSON = async function (url) {
	//? ovde ce da se fetchuje i konvertuje iz json-a istovremeno, pa bismo to mogli korisitit u citavom projektu
	try {
		// const res = await fetch(url);
		//! Promise.rece([1_promisa, 2_promisa, ..]), i ova Promise.race[] vraca onu Promisu koja se pre "izvrsi", tj. prva postane ili rejected ili fulfilled
		const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]); // dakle ako fetchovanje traje vise od 10s, izvrsi se timeout(10)
		const data = await res.json();

		if (!res.ok) throw new Error(`${data.message} (${res.status})`);

		return data; //* ovo data ce da bude resolve vrednost od Promise koju f-ja getJSON vraca. A ovu f-ju getJSON pozivamo u model.jsu loadRecipe koja je async te vraca Promise, a vracena Promise ce biti ono sto vracamo iz getJSON Promise, a to je ovo data.
	} catch (error) {
		throw error; //! moramo ovo a ne u konzoli, jer zelimo kad se trigeruje error ovoga, da u loadRecipe gde pozivamo ovu-fju, ukoliko bude errora, da se tamo ovo prikaze, tj. koja "tacno" greska je u pitanju
	}
};
