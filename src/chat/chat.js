import "./chat.scss";

import React, { useState, useEffect, useRef } from "react";
import { to_Encrypt } from "../aes";
import { useSelector } from "react-redux";

//gets the data from the action object and reducers defined earlier
function Chat({ username, roomname, socket }) {
    console.log("------ Rendering Chat component ... ")

    const sendData = (text) => {
        console.log("sendData:: text:", text, typeof (text))
        if (text !== "") {
            //encrypt the message here
            const ans = to_Encrypt(text);
            socket.emit("chat", ans);
        }
    };

    return (
        <div className="chat">
            <div className="user-name">
                <h2>
                    {username} <span style={{ fontSize: "0.7rem" }}>in {roomname}</span>
                </h2>
            </div>
            <ChatMessages {...{ username }} />
            <ChatBox {...{ sendData }} />
        </div>
    );
}

const ChatMessages = ({ username }) => {
    console.log("Rendering ChatMessages ...")

    const chat_reducer = useSelector(state => state.ChatReducer)

    const { messages } = chat_reducer

    console.log("ChatMessages:: chat_reducer.object_id", chat_reducer.object_id);
    console.log("ChatMessages:: messages", messages);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    return (
        <div className="chat-message">
            {messages.map((i) => {
                if (i.username === username) {
                    return (
                        <div className="message">
                            <p>{i.text}</p>
                            <span>{i.username}</span>
                        </div>
                    );
                } else {
                    return (
                        <div className="message mess-right">
                            <p>{i.text} </p>
                            <span>{i.username}</span>
                        </div>
                    );
                }
            })}
            <div ref={messagesEndRef} />
        </div>
    )
}

const ChatBox = ({ sendData }) => {
    const [text, setText] = useState("");

    console.log("text:", text)

    return (<div className="send">
        <input
            placeholder="enter your message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => {
                if (e.key === "Enter") {
                    sendData(text);
                    setText("");
                }
            }}
        ></input>
        <button onClick={() => { sendData(text); setText("") }}>Send</button>
    </div>)
}

export default Chat;