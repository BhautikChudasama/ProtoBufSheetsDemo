let logs = document.querySelector("#logs");

function addMessage(message) {
  let p = document.createElement("p");
  p.innerHTML = `TIME: ${Date.now()} <code>${message}</code>`;
  logs.appendChild(p);
}

document.querySelector("#send").addEventListener("click", e => {
  addMessage("BUTTON PRESSED!");
  let email = document.querySelector("#email").value;
  if (email.trim().length <= 0) alert("Enter valid email");
  else {
    protobuf.load("./awesome.proto", (err, root) => {
      if (err) console.log(err);
      let reqSchema = root.lookupType("sub.RequestMessage");
      let resSchema = root.lookupType("sub.ResponseMessage");
      
      let payload = { email: email.toString() };
      let errMsg = reqSchema.verify(payload);
      if (errMsg) console.log(errMsg);
      var message = reqSchema.create(payload);
      var buffer = reqSchema.encode(message).finish();
      addMessage("Request sending to endpoint");
      fetch("https://maroon-ribbon-vegetable.glitch.me/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-protobuf"
        },
        body: buffer
      })
        .then(res => res.arrayBuffer())
        .then(res => {
          addMessage("Response arrived...");
          alert("Subscribed sucessfully");
          addMessage(resSchema.decode(new Uint8Array(res)));
        })

        .catch(err => addMessage(err));
    });
  }
});
