//here we export the function process with the defined parameters and define action object PROCESS, which will return the same parameters as the payload.
export const process = (encrypt, text, cypher) => {
    return {
        type: "PROCESS",
        payload: {
            encrypt,
            text,
            cypher,
        },
    };
};

export const setLogged = (isLogged) => {
    return {
        type: "SET_LOGGED",
        payload: {
            isLogged: isLogged
        }
    }
}

export const setMessages = messages => {
    return {
        type: "SET_MESSAGES",
        payload: {
            messages
        }
    }
}