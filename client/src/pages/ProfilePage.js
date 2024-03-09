import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import { getFunctions, httpsCallable } from "firebase/functions";
import { functions } from "../config/firebase";

function ProfilePage() {
  const params = useParams();
  const [user, loading, error] = useAuthState(auth);
  const [membership, setMembership] = useState("loading");
  const [allStories, setAllStories] = useState([]);
  const [userData, setUserData] = useState([]);
  const [storyContentMap, setStoryContentMap] = useState({});

  const storyTitlesFetch = httpsCallable(functions, "getAllStories");
  const membershipChange = httpsCallable(functions, "changeMembership");
  const membershipCheck = httpsCallable(functions, "checkMembership");
  const getUserData = httpsCallable(functions, "getUserData");

  const handleMembershipCheck = (e) => {
    membershipCheck().then((response) => {
      const data = response.data;
    });
  };

  const handleMembershipChange = (toMembership) => {
    membershipChange({ newMembership: toMembership })
      .then((response) => {
        const data = response.data;
        setMembership(data.membershipStatus);
        console.log("[upgradeMembership] returned data:", data.result);
      })
      .catch((error) => {
        console.error("[upgradeMembership] Error adding message:", error);
      });
  };

  const displayStory = (index) => {
    setStoryContentMap((prev) => ({
      ...prev,
      [index]: allStories[index].data.content,
    }));
  };

  const closeStory = (index) => {
    setStoryContentMap((prev) => {
      const newMap = { ...prev };
      delete newMap[index];
      return newMap;
    });
  };

  const handleStoryDelete = (storyRefID, index) => {
    setAllStories((prev) => {
      return prev.filter((_, i) => i !== index);
    });

    setStoryContentMap((prev) => {
      const newMap = { ...prev };
      delete newMap[index];
      return newMap;
    });

    const storyDelete = httpsCallable(functions, "deleteStory");
    storyDelete({ refID: storyRefID })
      .then((response) => {
        console.log("Story:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    if (user && user.displayName === params.profileId) {
      // Call Cloud Function to fetch story titles when user is authenticated and authorized

      storyTitlesFetch()
        .then((response) => {
          console.log("Stories:", response.data.result);
          setAllStories(response.data.result);
        })
        .catch((error) => {
          console.error("Error fetching story titles:", error);
        });

      getUserData()
        .then((response) => {
          console.log("UserData", response.data.userData);
          setUserData(response.data.userData);
          setMembership(response.data.userData.membership);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [user, params.profileId]);

  if (loading) {
    return <h1>loading</h1>;
  }

  if (user?.displayName !== params.profileId) {
    return (
      <>
        <h1>You are not authorized</h1>
      </>
    );
  }

  if (user) {
    return (
      <>
        <h1>My Profile</h1>
        <img src={user.photoURL} alt="profilepic"></img>
        <p>username: {user.displayName}</p>
        <p>email: {user.email}</p>
        <p>Membership Status: {membership}</p>
        <button
          onClick={() => {
            handleMembershipChange("paid");
          }}
        >
          Upgrade Account
        </button>
        <button
          onClick={() => {
            handleMembershipChange("free");
          }}
        >
          Downgrade Account
        </button>
        <h2>My Stories</h2>
        <ul>
          {allStories.map((story, index) => (
            <li key={index}>
              {`${story.data.title} : `}
              <button onClick={() => displayStory(index)}>Read</button>
              <button onClick={() => handleStoryDelete(story.id, index)}>
                Delete
              </button>
              <button onClick={() => closeStory(index)}>Close</button>
              {storyContentMap[index] && <p>{storyContentMap[index]}</p>}
            </li>
          ))}
        </ul>
      </>
    );
  }
}

export default ProfilePage;
