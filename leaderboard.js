const getLeaderBoard = async () => {
  const snapshot = await db.collection("leaderboard").orderBy("score").get();
  const leaderboard = snapshot.docs.map((doc) => doc.data());
  window.leaderboard = leaderboard;
  var dropdown = `    <div class="btn-group d-flex p-2">
  <button type="button" class="btn btn-primary dropdown-toggle " data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Select Challenge
  </button>
  <div class="dropdown-menu">`;

  // <a class="dropdown-item" href="#">Action</a>
  //     <a class="dropdown-item" href="#">Another action</a>
  //     <a class="dropdown-item" href="#">Something else here</a>
  //     <div class="dropdown-divider"></div>
  // <a class="dropdown-item" href="#">Separated link</a>
  userId = 0;
  var titles = [];
  var challenges = db.collection("challenges").orderBy("participants");
  // where('participants', '==', userId)
  // .orderBy('participants').where('userId', '==', userId)
  challenges
    .get()
    .then(function (querySnapshot) {
      console.log(querySnapshot.size);
      querySnapshot.forEach(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.data().title, " => ", doc.data().participants);
        if (doc.data().participants[userId]) {
          titles.push(doc.data().title);
        }
      });

      titles.forEach(function (title) {
        dropdown += `<a class="dropdown-item" href="#">` + title + `</a>`;
        console.log(dropdown);
      });
      dropdown += `</div>
            </div> `;
      if (!$("#root").find(".btn-group")[0]) {
        $("#root").prepend(dropdown);
      }
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });

  // console.log(challenges.data)
  var tbody = el("tbody");
  var table = el(
    "table.table text-center text-nowrap",
    el(
      "thead",
      el(
        "tr",
        el("th", { scope: "col", innerText: "Place" }),
        el("th", { scope: "col", innerText: "Nickname" }),
        el("th", { scope: "col", innerText: "Overall Score" })
      )
    ),
    tbody
  );
  var i = 0;
  var rank;
  // leaderboard.reverse().forEach((user) => {
  //   i += 1;
  //   var className = "";
  //   if (user.userId == userId) {
  //     className = "#me";
  //     rank = i;
  //   }
  //   tbody.appendChild(
  //     el(
  //       `tr${className}`,
  //       el("th", { scope: "row", innerText: i }),
  //       el("td", { innerText: user.nickname }),
  //       el("td", { innerText: user.score })
  //     )
  //   );
  // });
  setChildren(
    document.getElementById("challenges1"),
    el("h4.text-center", {
      style: { paddingTop: "3vh", marginBottom: "0" },
      innerText: `Your rank is ${rank}`,
    })
  );
  // document.getElementById("challenges").appendChild(dropdown)
  setChildren(document.getElementById("challenges"), table);
};
