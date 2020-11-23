const getProfile = async (profileId = userId) => {
  var user = await db.collection("users").doc(profileId).get();
  const joined = await getUserChallenges(profileId);
  console.log(joined);
  console.log(user.data());
  user = user.data();
  setChildren(
    document.getElementById("challenges1"),
    el(
      ".card mx-auto",
      el(
        ".card-body bg-dark",
        el(
          ".card-title text-white",
          el(
            "",
            el(
              ".text-center",
              el("img.rounded-circle", {
                src: user.imgUrl,
                style: { height: "72px", width: "72px" },
              })
            ),
            el(
              "",
              el(".text-center large", {
                innerText: `Name: ${user.nickname}`,
                style: { marginTop: "10px" },
              }),
              el(".text-center large", {
                innerText: `Email address: ${user.email}`,
              })
            )
          )
        )
      )
    )
  );
  setChildren(document.getElementById("challenges"));
};
