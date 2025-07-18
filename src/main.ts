// 📌 Milestone 1
// Crea un type alias Person per rappresentare una persona generica.

// Il tipo deve includere le seguenti proprietà:

// id: numero identificativo, non modificabile
// name: nome completo, stringa non modificabile
// birth_year: anno di nascita, numero
// death_year: anno di morte, numero opzionale
// biography: breve biografia, stringa
// image: URL dell'immagine, stringa

type Person = {
  readonly id: number,
  readonly name: string,
  birth_year: number,
  death_year?: number,
  biography: string,
  image: string
}

// 📌 Milestone 2
// Crea un type alias Actress che oltre a tutte le proprietà di Person, aggiunge le seguenti proprietà:

// most_famous_movies: una tuple di 3 stringhe
// awards: una stringa
// nationality: una stringa tra un insieme definito di valori.
// Le nazionalità accettate sono: American, British, Australian, Israeli-American, South African, French, Indian, Israeli, Spanish, South Korean, Chinese.

type ActressNationality = "American" | "British" | "Australian" | "Israeli-American" | "South" | "African" | "French" | "Indian" | "Israeli" | "Spanish" | "South Korean" | "Chinese"

type Actress = Person & {
  most_famous_movies: [string, string, string],
  awards: string,
  nationality: ActressNationality
}

// 📌 Milestone 3
// Crea una funzione getActress che, dato un id, effettua una chiamata a:

// GET /actresses/:id
// La funzione deve restituire l’oggetto Actress, se esiste, oppure null se non trovato.

// Utilizza un type guard chiamato isActress per assicurarti che la struttura del dato ricevuto sia corretta.

function isActress(object: unknown): object is Actress {
  if (
    typeof object === 'object' &&
    object !== null &&
    'id' in object &&
    typeof object.id === 'number' &&
    'name' in object &&
    typeof object.name === 'string' &&
    'birth_year' in object &&
    typeof object.birth_year === 'number' &&
    'biography' in object &&
    typeof object.biography === 'string' &&
    'image' in object &&
    typeof object.image === 'string' &&
    (!('death_year' in object) || typeof object.death_year === 'number')
  ) {
    return true
  } else {
    return false
  }
}

async function getActress(id: number): Promise<Actress | null> {

  try {

    const res = await fetch(`http://localhost:3333/actresses/${id}`)
    if (!res.ok) {
      throw new Error("Errore HTTP, Errore Status")
    }

    const obj: unknown = await res.json()
    if (!isActress(obj)) {
      throw new Error("Errore nel formato dei dati")
    }
    return obj

  } catch (error) {

    if (error instanceof Error) {
      console.error("Errore durante il recupero dell'attrice: ", error)
    } else {
      console.error(error)
    }

    return null
  }

}

// console.log(getActress(1));


// 📌 Milestone 4
// Crea una funzione getAllActresses che chiama:

// GET /actresses
// La funzione deve restituire un array di oggetti Actress.

// Può essere anche un array vuoto.

async function getAllActresses(): Promise<Actress[]> {

  try {

    const res = await fetch(`http://localhost:3333/actresses`)
    if (!res.ok) {
      throw new Error("Errore HTTP, Errore Status")
    }

    const obj: unknown = await res.json()

    if (!(obj instanceof Array)) {
      throw new Error("formato non valido")
    }

    const validArray = obj.filter(attrice => isActress(attrice))

    return validArray

  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore durante il recupero delle attrici ", error)
    } else {
      console.error(error)
    }

    return []
  }

}

// console.log(getAllActresses());

// 📌 Milestone 5
// Crea una funzione getActresses che riceve un array di numeri (gli id delle attrici).

// Per ogni id nell’array, usa la funzione getActress che hai creato nella Milestone 3 per recuperare l’attrice corrispondente.

// L'obiettivo è ottenere una lista di risultati in parallelo, quindi dovrai usare Promise.all.

// La funzione deve restituire un array contenente elementi di tipo Actress oppure null (se l’attrice non è stata trovata).

async function getActresses(arr: number[]): Promise<(Actress | null)[]> {


  try {
    const promises = arr.map(id => getActress(id))
    const res = await Promise.all(promises)

    return res
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore durante il recupero delle attrici ", error)
    } else {
      console.error(error)
    }
    return []
  }

}

console.log(getActresses([1, 2, 3, 4]));


