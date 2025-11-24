import { create } from 'zustand'

export const WAYPOINTS = {
    RUG: [1, 0.25, 1],        // Center (Carpet area)
    DESK: [-3, 0.25, -3.5],   // North-West (Desk)
    DJ: [-2, 0.25, 2],        // South-West (DJ Booth)
    WINDOW: [-5, 0.25, 0],    // West (Window)
    BOOKSHELF: [4, 0.25, -3]  // East (Bookshelf)
}

export const useStore = create((set) => ({
    characterState: 'IDLE', // IDLE, WALKING, DRAGGED, MEDITATING, DJING, WORKING
    targetPosition: WAYPOINTS.RUG,
    activeModal: null, // 'SPOTIFY', 'CONTACT', or null
    dialogue: null,

    // Audio State
    isMuted: false,
    audioStates: {
        bird: false,
        coffee: false
    },

    // Camera State
    cameraRotation: 0, // In radians

    setCharacterState: (state) => set({ characterState: state }),
    setTargetPosition: (pos) => set({ targetPosition: pos }),
    setActiveModal: (modal) => set({ activeModal: modal }),
    setDialogue: (text) => set({ dialogue: text }),

    // Audio Actions
    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
    toggleAudio: (type) => set((state) => ({
        audioStates: { ...state.audioStates, [type]: !state.audioStates[type] }
    })),

    // Camera Actions
    rotateCamera: (direction) => set((state) => ({
        cameraRotation: state.cameraRotation + (direction === 'left' ? 0.5 : -0.5)
    })),

    // Actions
    triggerRandomDialogue: () => {
        const dialogues = [
            "This rug is so soft...",
            "I should water the plants.",
            "Time to mix some beats!",
            "Did I hear a bird?",
            "Working hard or hardly working?",
            "I need a coffee..."
        ]
        const text = dialogues[Math.floor(Math.random() * dialogues.length)]
        set({ dialogue: text })
        setTimeout(() => set({ dialogue: null }), 3000)
    },

    pickRandomWaypoint: () => {
        const keys = Object.keys(WAYPOINTS)
        const randomKey = keys[Math.floor(Math.random() * keys.length)]
        return WAYPOINTS[randomKey]
    }
}))
