import { create } from 'zustand'

const createUsuarioSlice = (set) => ({
    usuario: '',
    setUsuario: (usuario) =>
    set(() => ({ usuario })),
})

const createCarreraSlice = (set) => ({
    carrera: '',
    setCarrera: (carrera) =>
    set(() => ({ carrera })),
})


export const useUserStore = create((...a) => ({
    ...createUsuarioSlice(...a),
    ...createCarreraSlice(...a),
}))
