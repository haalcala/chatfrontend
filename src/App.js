import Chat from "./chat/chat";
import Process from "./process/process";
import Home from "./home/home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.scss";
import React, { useEffect } from "react";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { process, setLogged, setMessages } from "./store/action";
import { to_Decrypt, to_Encrypt } from "./aes";

const socket = io.connect('/');

function Appmain(props) {
  return (
    <React.Fragment>
      <div className="right">
        <Chat
          username={props.match.params.username}
          roomname={props.match.params.roomname}
          socket={socket}
        />
      </div>
      <div className="left">
        <Process />
      </div>
    </React.Fragment>
  );
}

function getComponentRoutes() {
  return [
    <Route path="/chat/:roomname/:username" component={Appmain} />
  ]
}

function App() {
  console.log("--------------------------------------------- Rendering App ....")
  const { isLogged } = useSelector((state) => state.LoginReducer);

  const chat_state = useSelector(state => state.ChatReducer)

  console.log("App:: isLogged:", isLogged)

  console.log("App:: chat_state.object_id:", chat_state.object_id)
  console.log("App:: chat_state.messages:", chat_state.messages)

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("App:: useEffect ... chat_state.object_id:", chat_state.object_id)

    if (!chat_state.object_id) {
      chat_state.object_id = new Date().getTime()
    }

    socket.on("unkown_user", (data) => {
      console.log("socket.on:unkown_user:: data:", data)

      dispatch(setLogged(false))
    });

    socket.on("message", (data) => {
      //decypt the message

      console.log("socket.on(message):: data:", data)
      console.log("socket.on(message)::chat_state.object_id:", chat_state.object_id)

      const ans = to_Decrypt(data.text, data.username);

      dispatch(process(false, ans, data.text));

      console.log(ans);

      console.log("App:: 1111 chat_state.messages:", chat_state.messages)

      let temp = chat_state.messages;

      temp.push({
        userId: data.userId,
        username: data.username,
        text: ans,
      });

      dispatch(setMessages(temp))
    });
  }, [socket]);

  console.log("isLogged:", isLogged)

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact>
            <Home socket={socket} />
          </Route>
          {isLogged ?
            getComponentRoutes()
            : <Home socket={socket} />
          }
        </Switch>
      </div>
    </Router>
  );
}

export default App;