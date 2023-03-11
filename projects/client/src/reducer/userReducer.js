const INITIAL_STATE = {
    email: "",
    name: "",
    phone: "",
    gender: "",
    profileImg: "",
    dob: "",
    role: "",
    isDelete: false,
    isVerified: false,
    isActive: false,
    provider: "common"
}

export const userReducer = (state = INITIAL_STATE, action ) =>{
    switch (action.type) {
        case `LOGIN_SUCCESS`:
            return {...state, ...action.payload};
        case `LOGOUT_SUCCESS`:
            return state;
        default:
            return state;
    }
}
