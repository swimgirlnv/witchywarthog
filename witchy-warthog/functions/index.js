const admin = require("firebase-admin");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");

admin.initializeApp();

const db = admin.firestore();
const LOBBY_TTL_MS = 12 * 60 * 60 * 1000;
const FINISHED_GAME_TTL_MS = 7 * 24 * 60 * 60 * 1000;

exports.cleanupGameRooms = onSchedule("every 24 hours", async () => {
  const collections = await db.listCollections();
  const gameCollections = collections.filter((collection) =>
    collection.id.startsWith("games_"));

  let deleted = 0;
  const now = Date.now();

  for (const collection of gameCollections) {
    const snapshot = await collection.get();
    const batch = db.batch();
    let deletedInCollection = 0;

    snapshot.docs.forEach((docSnap) => {
      const room = docSnap.data();
      const updatedAt = room.updatedAt || room.createdAt || 0;
      const isStaleLobby = room.status === "lobby" &&
        now - updatedAt > LOBBY_TTL_MS;
      const isExpiredFinishedGame = room.status === "playing" &&
        room.gameState &&
        room.gameState.gameEnded === true &&
        now - updatedAt > FINISHED_GAME_TTL_MS;

      if (isStaleLobby || isExpiredFinishedGame) {
        batch.delete(docSnap.ref);
        deleted += 1;
        deletedInCollection += 1;
      }
    });

    if (deletedInCollection > 0) {
      await batch.commit();
    }
  }

  logger.info("Game room cleanup complete.", {deleted});
});
