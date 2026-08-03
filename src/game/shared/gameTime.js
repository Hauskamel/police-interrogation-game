const INITIAL_GAME_TIMESTAMP = "2026-08-03T08:00:00.000Z";

let realTimeOrigin = Date.now();
let gameTimeOrigin = new Date(INITIAL_GAME_TIMESTAMP).getTime();

// ##### Game Clock
// -----> Liefert den zentralen fachlichen Spielzeitpunkt fuer alle zeitabhaengigen Systeme.
// ---> Reale verstrichene Zeit laeuft ab einem festen Spieltag weiter, damit Kontrolldauern funktionieren.
export function getCurrentGameDate() {
    const elapsedRealTime = Date.now() - realTimeOrigin;

    return new Date(gameTimeOrigin + elapsedRealTime);
}

export function getCurrentGameTimestamp() {
    return getCurrentGameDate().toISOString();
}

export function getCurrentGameDateString() {
    return getCurrentGameTimestamp().split("T")[0];
}

// ##### Game Clock Reset
// -----> Beginnt eine neue Spielsitzung wieder am definierten Referenzzeitpunkt.
export function resetGameClock() {
    realTimeOrigin = Date.now();
    gameTimeOrigin = new Date(INITIAL_GAME_TIMESTAMP).getTime();
}
