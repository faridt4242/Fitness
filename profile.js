const getProfile = async (profileId = userId) => {
  var user = await db.collection("users").doc(profileId).get();
  const joined = await getUserChallenges(profileId);
  console.log(joined);
  console.log(user.data());
  user = user.data();
  setChildren(document.getElementById("challenges1"));
  setChildren(document.getElementById("challenges"));

  document.getElementById("challenges").innerHTML = `
  <div>Nickname: ${user.nickname}</div>
  <div>Email: ${user.email}</div>
  <img style="height: 72px; width: 72px;" class="rounded-circle" src="${user.imgUrl}" />
  `;
};

// function to get all challenges of user with ID
const getUserChallenges = async (id) => {
  var challenges = await db.collection("challenges").get();
  var joined = [];
  challenges.docs.map((doc) => {
    if (doc.data().participants[id]) joined.push(doc.data());
  });
  return joined;
};
