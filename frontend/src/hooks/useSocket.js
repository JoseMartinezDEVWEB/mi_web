/* Hook para gestionar la conexión de Socket.io */
import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

export default function useSocket(namespace = '/') {
  const socketRef = useRef(null)

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:4000'

    socketRef.current = io(`${socketUrl}${namespace}`, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      autoConnect: true,
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [namespace])

  return socketRef
}
