const socket = io();
let room, username;

document.getElementById("join").onclick = () => {
  username = document.getElementById("username").value.trim();
  room = document.getElementById("room").value.trim();

  if (!username || !room) return alert("Enter username & room code");

  socket.emit("join-room", room, username);
  document.getElementById("login").style.display = "none";
  document.getElementById("chat").style.display = "block";
  document.getElementById("room-name").innerText = `Room: ${room}`;
};

document.getElementById("send").onclick = () => {
  const msg = document.getElementById("msg").value.trim();
  if (!msg) return;
  addMessage(`You: ${msg}`, "you");
  socket.emit("send-message", room, { username, msg });
  document.getElementById("msg").value = "";
};

socket.on("receive-message", (data) => addMessage(`${data.username}: ${data.msg}`, "peer"));
socket.on("user-joined", (name) => addMessage(`🔔 ${name} joined`, "peer"));
socket.on("user-left", (name) => addMessage(`🔔 ${name} left`, "peer"));

function addMessage(msg, type="peer") {
  const div = document.createElement("div");
  div.classList.add("msg", type);
  div.textContent = msg;
  document.getElementById("messages").appendChild(div);
  document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
}
