const getProfile = async (profileId = userId) => {
  var user = await db.collection("users").doc(profileId).get();
  const joined = await getUserChallenges(profileId);
  console.log(joined);
  console.log(user.data());
  user = user.data();
  var userPage = el(
    "#challenges1",
    { style: { height: "45vh" } },
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
              }),
              el(
                ".text-center",
                el("button.btn btn-danger", {
                  innerText: "Sign out",
                  onclick: () => signOut(),
                })
              )
            )
          )
        )
      )
    )
  );

  var previous = el("ul.list-group mx-auto", { style: { width: "95%" } });
  joined.forEach((element) => {
    previous.appendChild(
      el(
        "li.list-group-item",
        el(".md-v-line"),

        el(
          "",
          {
            style: { cursor: "pointer" },
            innerHTML: `${element.title}`,
            onclick: () => {
                Router('lead'),
              getLeaderBoard(element.id);
              Router("lead");
            },
          },
          el(".fas fa-play float-right", {
            style: { margin: "5px", cursor: "pointer" },
            onclick: () => {
              window.open(element.participants[profileId].videoUrl);
            },
          })
        )
      )
    );
  });
  setChildren(
    document.getElementById("root"),
    userPage,
    el(
      ".challenges",
      { style: { height: "46vh" } },

      el("#challenges", previous)
    )
  );
};
