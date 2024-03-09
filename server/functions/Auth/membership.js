const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const functions = require("firebase-functions");
const { error } = require("firebase-functions/logger");

exports.checkMembership = onCall(async (request) => {
  try {
    const userID = request.auth.uid;
    const querySnapshot = await getFirestore()
      .collection("users")
      .doc(userID)
      .get();
    console.log(querySnapshot.data());
  } catch (error) {}
});

exports.changeMembership = onCall(async (request) => {
  try {
    const userID = request.auth.uid;
    const newMembership = request.data.newMembership;

    await getFirestore()
      .collection("users")
      .doc(userID)
      .update({ membership: newMembership });

    return {
      result: `membership changed to ${newMembership}: ${userID}.`,
      upgradedUserID: userID,
      membershipStatus: newMembership,
    };
  } catch (error) {
    console.error("Failed to membership change:", error);
    throw new HttpsError(
      "unknown",
      "Failed to membership change an account.",
      error
    );
  }
});
