const getProfile = async (profileId = userId) => {
  const user = await db.collection("users").doc(profileId).get();
  console.log(user.data());
  setChildren(document.getElementById("challenges1"));
  setChildren(document.getElementById("challenges"));
};
