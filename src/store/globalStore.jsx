import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// --- Slices ---

const createAnioSeleccionadoSlice = (set) => ({
  anioSeleccionado: 'all',
  setAnioSeleccionado: (anio) => set({ anioSeleccionado: anio }),
})

const createAniosSlice = (set) => ({
  anios: [],
  setAnios: (anios) => set({ anios }),
})

const createTerminosSlice = (set) => ({
  terminos: [],
  setTerminos: (terminos) => set({ terminos }),
})

const createCarrerasSlice = (set) => ({
  carreras: [],
  setCarreras: (carreras) => set({ carreras }),
})

const createCarreraSeleccionadaSlice = (set) => ({
  carreraSeleccionada: 'all',
  setCarreraSeleccionada: (carrera) => set({ carreraSeleccionada: carrera }),
})

const createTerminoSeleccionadoSlice = (set) => ({
  terminoSeleccionado: 'all',
  setTerminoSeleccionado: (termino) => set({ terminoSeleccionado: termino }),
})

const createMateriasMallaSlice = (set) => ({
  materiasMalla: [],
  setMateriasMalla: (materias) => set({ materiasMalla: materias }),
})

const createMallaBuscadorSlice = (set) => ({
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),
})

const createPathnameSlice = (set) => ({
  pathname: '',
  setPathname: (path) => set({ pathname: path }),
})

// --- Store Global con Persistencia ---

export const useGlobalStore = create(
  persist(
    (...a) => ({
      ...createCarrerasSlice(...a),
      ...createAniosSlice(...a),
      ...createTerminosSlice(...a),
      ...createCarreraSeleccionadaSlice(...a),
      ...createAnioSeleccionadoSlice(...a),
      ...createTerminoSeleccionadoSlice(...a),
      ...createMateriasMallaSlice(...a),
      ...createMallaBuscadorSlice(...a),
      ...createPathnameSlice(...a),
    }),
    {
      name: 'app-global-state', // Nombre de la clave en LocalStorage
      // Si quieres que TODO se guarde, puedes dejarlo solo con el name.
      // Si quieres evitar que el buscador se guarde al recargar, usa partialize:
      partialize: (state) => 
        Object.fromEntries(
          Object.entries(state).filter(([key]) => key !== 'searchTerm')
        ),
    }
  )
)