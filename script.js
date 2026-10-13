
const chat = document.getElementById("chat");
const input = document.getElementById("message");
const form = document.getElementById("form");
const history = document.getElementById("history");
const options = document.getElementById("options");
const scrollBtn = document.getElementById("scrollBottom");

let chats = [];
let currentChat = null;
let nextId = 1;

// Send a message
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    if (currentChat === null) {
        currentChat = {
            id: nextId++,
            title: text.slice(0, 28),
            messages: []
        };

        chats.unshift(currentChat);
    }

    currentChat.messages.push({ sender: "You", text: text });

    const answer = getReply(text);
    currentChat.messages.push({ sender: "Chat GPT", text: answer });

    input.value = "";
    renderChat();
    renderHistory();
});

// Simple demo replies
function getReply(text) {
    text = text.toLowerCase();

    if (text.includes("html"))
        return "HTML creates the structure of a web page.";

    if (text.includes("css"))
        return "CSS styles a web page with colors and layouts.";

    if (text.includes("javascript"))
        return "JavaScript makes a web page interactive.";

    if (text.includes("hello") || text.includes("hi"))
        return "Hey bhai! Welcome to Chat GPT. 😎";

    if (text.includes("idea"))
        return "Try building a portfolio, to-do list, or weather app.";

    return "Thanks for your message! I am a demo chatbot, not a real AI model.";
}

// Display messages safely
function showMessage(sender, text) {
    const div = document.createElement("div");
    div.className = sender === "You" ? "message user" : "message bot";

    const heading = document.createElement("strong");
    heading.textContent = sender;

    const paragraph = document.createElement("p");
    paragraph.textContent = text;

    div.append(heading, paragraph);
    chat.appendChild(div);
}

// Display current conversation
function renderChat() {
    chat.innerHTML = "";

    if (!currentChat) {
        showWelcome();
        return;
    }

    currentChat.messages.forEach(function(message) {
        showMessage(message.sender, message.text);
    });

    scrollToBottom();
}

// Welcome screen
function showWelcome() {
    chat.innerHTML = `
        <div id="welcome">
            <h1>What can I help with?</h1>
            <p>Your ideas. Your AI assistant.</p>
            <div class="cards">
                <button data-prompt="Explain HTML">💻 <b>Learn HTML</b><small>Web structure</small></button>
                <button data-prompt="Explain CSS">🎨 <b>Learn CSS</b><small>Web styling</small></button>
                <button data-prompt="Explain JavaScript">⚡ <b>Learn JavaScript</b><small>Interactivity</small></button>
                <button data-prompt="Give me project ideas">💡 <b>Get Ideas</b><small>New projects</small></button>
            </div>
        </div>`;
}

// Start a new chat
document.getElementById("newChat").addEventListener("click", function() {
    currentChat = null;
    input.value = "";
    renderChat();
    renderHistory();
    input.focus();
});

// Click a suggested prompt
chat.addEventListener("click", function(event) {
    const button = event.target.closest("[data-prompt]");
    if (!button) return;

    input.value = button.dataset.prompt;
    input.focus();
});

// Display conversation history
function renderHistory() {
    history.innerHTML = "";

    chats.forEach(function(item) {
        const button = document.createElement("button");
        button.className = "history-item";
        button.textContent = item.title;

        if (currentChat && item.id === currentChat.id) {
            button.classList.add("active");
        }

        button.addEventListener("click", function() {
            currentChat = item;
            renderChat();
            renderHistory();
        });

        history.appendChild(button);
    });
}

// Toggle the + menu
document.getElementById("plusBtn").addEventListener("click", function() {
    options.classList.toggle("show");
});

// Upload a file
document.getElementById("uploadBtn").addEventListener("click", function() {
    document.getElementById("fileInput").click();
    options.classList.remove("show");
});

// Choose a photo; mobile browsers may offer camera options
document.getElementById("photoBtn").addEventListener("click", function() {
    document.getElementById("photoInput").click();
    options.classList.remove("show");
});

// Add text
document.getElementById("textBtn").addEventListener("click", function() {
    input.focus();
    options.classList.remove("show");
});

// Show selected file name in the input
document.getElementById("fileInput").addEventListener("change", function() {
    if (this.files.length) {
        input.value += (input.value ? " " : "") +
            "[File: " + this.files[0].name + "]";
        input.focus();
    }
});

document.getElementById("photoInput").addEventListener("change", function() {
    if (this.files.length) {
        input.value += (input.value ? " " : "") +
            "[Photo: " + this.files[0].name + "]";
        input.focus();
    }
});

// Toggle light and dark themes
document.getElementById("themeBtn").addEventListener("click", function() {
    document.body.classList.toggle("light");
});

// About button
document.getElementById("aboutBtn").addEventListener("click", function() {
    alert("Chat GPT is a front-end chatbot demo built with HTML, CSS and JavaScript.");
});

// Scroll to latest message
function scrollToBottom() {
    chat.scrollTo({
        top: chat.scrollHeight,
        behavior: "smooth"
    });
}

// Show scroll button when viewing older messages
chat.addEventListener("scroll", function() {
    const awayFromBottom =
        chat.scrollHeight - chat.scrollTop - chat.clientHeight > 50;

    scrollBtn.classList.toggle("show", awayFromBottom);
});

scrollBtn.addEventListener("click", scrollToBottom);

// Initial setup
showWelcome();
renderHistory();

