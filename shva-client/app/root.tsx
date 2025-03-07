// noinspection JSUnusedGlobalSymbols

import { ErrorBoundary } from '@/components/ErrorBoundary'
import type { IAuthResponse, IUserResponse, IUsersResponse, IGlobalContext } from '@/types'
import { apiUrl } from '@/utils'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Outlet } from 'react-router'
import './index.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { Layout } from '@/Layout'
import { globalContext } from '@/contexts/globalContext'

export { Layout }

export default function App() {
  const checkAuthAndGetTries = useRef(0)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [users, setUsers] = useState<IUserResponse[] | []>([])
  
  const setGlobalState = useCallback(
    (newState: Partial<IGlobalContext>) => {
      if (newState.isAuthorized !== undefined) {
        setIsAuthorized(newState.isAuthorized)
      }
      if (newState.users !== undefined) {
        setUsers(newState.users)
      }
    },
    [],
  )
  
  useEffect(() => {
    const checkAuthAndGetData = async () => {
      const token = localStorage.getItem('accessToken')
      checkAuthAndGetTries.current++
      if (checkAuthAndGetTries.current > 5) {
        localStorage.removeItem('accessToken')
        return
      }
      if (token) {
        try {
          const res = await fetch(
            apiUrl + '/users',
            {
              headers: { Authorization: `Bearer ${token}` },
              credentials: 'include',
            },
          )
          if (res.ok) {
            const usersData: IUsersResponse = await res.json()
            if (Array.isArray(usersData)) {
              setGlobalState({ users: usersData, isAuthorized: true })
            } else {
              setGlobalState({ isAuthorized: true })
            }
            return
          } else if (res.status === 401) {
            try {
              const refreshRes = await fetch(
                apiUrl + '/refresh'
                , { credentials: 'include' },
              )
              if (refreshRes.ok) {
                const refreshData: IAuthResponse = await refreshRes.json()
                if ('accessToken' in refreshData) {
                  localStorage.setItem('accessToken', refreshData.accessToken)
                  await checkAuthAndGetData()
                  setGlobalState({ isAuthorized: true })
                } else {
                  localStorage.removeItem('accessToken')
                  setGlobalState({ isAuthorized: false })
                }
              } else {
                localStorage.removeItem('accessToken')
                setGlobalState({ isAuthorized: false })
              }
            } catch (refreshError) {
              localStorage.removeItem('accessToken')
              setGlobalState({ isAuthorized: false })
            }
          } else {
            localStorage.removeItem('accessToken')
            setGlobalState({ isAuthorized: false })
          }
        } catch (error) {
          console.error('Error during authentication check:', error)
          localStorage.removeItem('accessToken')
          setGlobalState({ isAuthorized: false })
        }
      } else {
        setGlobalState({ isAuthorized: false })
      }
    }
    
    void checkAuthAndGetData()
  }, [])
  
  useEffect(() => {
    const allowedPaths = ['/', '/register']
    if (!isAuthorized && !allowedPaths.includes(location.pathname)) {
      navigate('/')
    } else if (isAuthorized && location.pathname === '/') {
      navigate('/users')
    }
  }, [isAuthorized, location, navigate])
  
  const contextValue = useMemo(
    () => ({ isAuthorized, setIsAuthorized, users, setGlobalState }),
    [isAuthorized, setIsAuthorized, users, setGlobalState],
  )

  return (
    <globalContext.Provider value={contextValue}>
      <Outlet />
    </globalContext.Provider>
  )
}

export { ErrorBoundary }


