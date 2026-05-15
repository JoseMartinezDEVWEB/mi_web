/* Configuración de eventos de Socket.io para el chat en tiempo real */

export function setupChatSocket(io) {
  /* Namespace dedicado al chat */
  const chatNs = io.of('/chat')

  chatNs.on('connection', (socket) => {
    console.log(`🔌 Cliente conectado al chat: ${socket.id}`)

    /* Evento de usuario escribiendo (para mostrar typing indicator) */
    socket.on('typing', ({ sessionId }) => {
      socket.to(sessionId).emit('user:typing', { sessionId })
    })

    /* Unirse a una sala de sesión específica */
    socket.on('join:session', ({ sessionId }) => {
      socket.join(sessionId)
    })

    socket.on('disconnect', () => {
      console.log(`🔌 Cliente desconectado del chat: ${socket.id}`)
    })
  })
}
