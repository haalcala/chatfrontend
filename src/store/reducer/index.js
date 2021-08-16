// import the reducers
import { ProcessReducer } from "./process";
import { combineReducers } from "redux";
// define the object and call the action

const LoginReducer = (state = { isLogged: false }, action) => {
    console.log("LoginReducer called:: state:", state, "action:", action)
    switch (action.type) {
        case "SET_LOGGED":
            console.log(" action.payload.isLogged:", action.payload.isLogged)
            return { ...state, isLogged: action.payload.isLogged || false }
        default:
            return state
    }
}

const ChatReducer = (state = { messages: [] }, action) => {
    console.log("ChatReducer called:: state:", state, "action:", action)
    switch (action.type) {
        case "SET_MESSAGES":
            state.messages = action.payload.messages || []
        case "SET_LOGGED":
            console.log("action.payload.isLogged:", action.payload.isLogged)
            if (!action.payload.isLogged) {
                state.messages.splice(0, state.messages.length)
            }
        default:
            console.log("ChatReducer:: Returning state:", state)
            return state
    }
}

const rootReducers = combineReducers({
    ProcessReducer,
    LoginReducer,
    ChatReducer,
});

// else return default root reducer
export default rootReducers;