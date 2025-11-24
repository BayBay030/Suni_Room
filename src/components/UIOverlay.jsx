import { useStore } from '../store'
import { AnimatePresence, motion } from 'framer-motion'

function RetroWindow({ title, onClose, children }) {
    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-[#c0c0c0] p-1 shadow-[inset_-2px_-2px_#0a0a0a,inset_2px_2px_#dfdfdf] border-2 border-[#dfdfdf] w-full max-w-md pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Title Bar */}
            <div className="bg-[#000080] px-2 py-1 flex justify-between items-center mb-2">
                <span className="text-white font-bold text-sm tracking-wide">{title}</span>
                <button
                    onClick={onClose}
                    className="bg-[#c0c0c0] w-5 h-5 flex items-center justify-center text-xs font-bold shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#dfdfdf] active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#dfdfdf]"
                >
                    ✕
                </button>
            </div>
            {/* Content */}
            <div className="p-4">
                {children}
            </div>
        </motion.div>
    )
}

export function UIOverlay() {
    const { activeModal, setActiveModal, rotateCamera, toggleMute, isMuted } = useStore()

    return (
        <div className="absolute inset-0 pointer-events-none">
            {/* Retro Modal Overlay */}
            <AnimatePresence>
                {activeModal && (
                    <div
                        className="absolute inset-0 bg-black/20 flex items-center justify-center p-4 z-50 pointer-events-auto"
                        onClick={() => setActiveModal(null)}
                    >
                        {activeModal === 'SPOTIFY' && (
                            <RetroWindow title="Spotify Player.exe" onClose={() => setActiveModal(null)}>
                                <div className="bg-black text-white p-4 text-center mb-4 rounded border border-gray-600">
                                    <p className="text-green-500 font-mono mb-2">{'>'} Loading Playlist...</p>
                                    <iframe
                                        style={{ borderRadius: '12px' }}
                                        src="https://open.spotify.com/embed/playlist/6O0v9GICd4VA50xVSPTpUk?utm_source=generator&theme=0"
                                        width="100%"
                                        height="152"
                                        frameBorder="0"
                                        allowFullScreen=""
                                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                        loading="lazy"
                                    ></iframe>
                                </div>
                                <div className="text-center">
                                    <button
                                        className="bg-[#c0c0c0] px-4 py-1 shadow-[inset_-2px_-2px_#0a0a0a,inset_2px_2px_#dfdfdf] active:shadow-[inset_2px_2px_#0a0a0a,inset_-2px_-2px_#dfdfdf] font-bold text-sm"
                                        onClick={() => window.open('https://open.spotify.com/playlist/6O0v9GICd4VA50xVSPTpUk', '_blank')}
                                    >
                                        Open in App
                                    </button>
                                </div>
                            </RetroWindow>
                        )}

                        {activeModal === 'CONTACT' && (
                            <RetroWindow title="Contact_Info.txt" onClose={() => setActiveModal(null)}>
                                <div className="bg-white border-2 border-gray-400 inset-shadow p-4 font-mono text-sm mb-4 h-32 overflow-y-auto shadow-[inset_2px_2px_#0a0a0a]">
                                    <p>Name: BayBay</p>
                                    <p>Role: Suni</p>
                                    <p>Find me on: IG <a href="https://www.instagram.com/unicorn_mani" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@unicorn_mani</a></p>
                                    <br />
                                    <p>{'>'} Message: Stay with me ♥</p>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        className="bg-[#c0c0c0] px-4 py-1 shadow-[inset_-2px_-2px_#0a0a0a,inset_2px_2px_#dfdfdf] active:shadow-[inset_2px_2px_#0a0a0a,inset_-2px_-2px_#dfdfdf] font-bold text-sm"
                                        onClick={() => setActiveModal(null)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-[#c0c0c0] px-4 py-1 shadow-[inset_-2px_-2px_#0a0a0a,inset_2px_2px_#dfdfdf] active:shadow-[inset_2px_2px_#0a0a0a,inset_-2px_-2px_#dfdfdf] font-bold text-sm"
                                        onClick={() => window.open('https://www.instagram.com/unicorn_mani', '_blank')}
                                    >
                                        Connect via IG
                                    </button>
                                </div>
                            </RetroWindow>
                        )}
                    </div>
                )}
            </AnimatePresence>

            {/* Bottom Right Controls */}
            <div className="absolute bottom-4 right-4 flex gap-2 pointer-events-auto">
                <button
                    className="bg-white/80 hover:bg-white p-3 rounded-full shadow-lg backdrop-blur text-xl transition-transform active:scale-95"
                    onClick={() => rotateCamera('left')}
                    title="Rotate Left"
                >
                    ↺
                </button>
                <button
                    className="bg-white/80 hover:bg-white p-3 rounded-full shadow-lg backdrop-blur text-xl transition-transform active:scale-95"
                    onClick={() => rotateCamera('right')}
                    title="Rotate Right"
                >
                    ↻
                </button>
                <div className="w-4" /> {/* Spacer */}
                <button
                    className={`p-3 rounded-full shadow-lg backdrop-blur text-xl transition-transform active:scale-95 ${isMuted ? 'bg-red-100 text-red-500' : 'bg-white/80 text-gray-800'}`}
                    onClick={toggleMute}
                    title="Toggle Mute"
                >
                    {isMuted ? '🔇' : '🔊'}
                </button>
            </div>
        </div>
    )
}
