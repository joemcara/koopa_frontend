import {create} from "zustand";

const createUsernameSlice = (set) => ({
    username: "",
    setUsername: (username) => set({username}),
});

const createPasswordSlice = (set) => ({
    password: "",
    setPassword: (password) => set({password}),
});

const createCarreraSlice = (set) => ({
    carrera: "",
    setCarrera: (carrera) => set({carrera}),
});

export const useUserFormStore = create((...a) => ({
    ...createUsernameSlice(...a),
    ...createPasswordSlice(...a),
    ...createCarreraSlice(...a),
}));
