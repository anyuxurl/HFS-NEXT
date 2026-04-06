'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { useStorage } from '@/hooks/useStorage'

export function useRequireAuth() {
  const [token, setToken] = useStorage('hfs_token')
  const router = useRouter()
  const hasRedirected = useRef(false)

  useEffect(() => {
    if (!token && !hasRedirected.current) {
      hasRedirected.current = true
      toast.error('你还没登录，返回登录页')
      router.replace('/login')
    }
  }, [token, router])

  return {
    token,
    setToken,
    isAuthenticated: Boolean(token),
  }
}
