import { create } from 'zustand'

const createSemestreSeleccionadoSlice = (set) => ({
  semestreSeleccionado: 'all',
  setSemestreSeleccionado: (semestre) =>
    set(() => ({ semestreSeleccionado: semestre })),
})

const createSemestresSlice = (set) => ({
  semestres: [],
  setSemestres: (semestres) =>
    set(() => ({  semestres })),
})

const createCarrerasSlice = (set) => ({
  carreras: [],
  setCarreras: (carreras) =>
    set(() => ({  carreras })),
})

const createCarreraSeleccionadaSlice = (set) => ({
  carreraSeleccionada: 'all',
  setCarreraSeleccionada: (carrera) =>
    set(() => ({ carreraSeleccionada: carrera })),
})

const createMateriasMallaSlice = (set) => ({
  materiasMalla: [],
  setMateriasMalla: (materias) =>
    set(() => ({ materiasMalla: materias })), 
})

const createMallaBuscadorSlice = (set) => ({
  searchTerm: '',
  setSearchTerm: (term) =>
    set(() => ({ searchTerm: term })),
})

export const useGlobalStore = create((...a) => ({
  ...createSemestreSeleccionadoSlice(...a),
  ...createSemestresSlice(...a),
  ...createCarrerasSlice(...a),
  ...createCarreraSeleccionadaSlice(...a),
  ...createMateriasMallaSlice(...a),
  ...createMallaBuscadorSlice(...a),
}))