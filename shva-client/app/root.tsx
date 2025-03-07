// noinspection JSUnusedGlobalSymbols
import { ErrorBoundary } from '@/components/ErrorBoundary'
import type { IAuthResponse, IUserResponse, IUsersResponse, IGlobalContext } from '@/types'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Outlet } from 'react-router'
import './index.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { Layout } from '@/Layout'
import { globalContext } from '@/contexts/globalContext'
export {Layout}

export default function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState<IUserResponse[] | []>([]);
  
  const setGlobalState = useCallback(
    (newState: Partial<IGlobalContext>) => {
      if (newState.isAuthorized !== undefined) {
        setIsAuthorized(newState.isAuthorized);
      }
      if (newState.users !== undefined) {
        setUsers(newState.users);
      }
    },
    []
  );
  
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await fetch(
            process.env.REACT_APP_API_URL + '/users',
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          
          if (res.ok) {
            const usersData: IUsersResponse = await res.json();
            if (Array.isArray(usersData)) {
              setGlobalState({ users: usersData, isAuthorized: true });
            } else {
              setGlobalState({ isAuthorized: true });
            }
          } else if (res.status === 401) {
            try {
              const refreshRes = await fetch(
                process.env.REACT_APP_API_URL + '/refresh'
              );
              if (refreshRes.ok) {
                const refreshData: IAuthResponse = await refreshRes.json();
                if ('accessToken' in refreshData) {
                  localStorage.setItem('accessToken', refreshData.accessToken);
                  void checkAuth();
                } else {
                  localStorage.removeItem('accessToken');
                  setGlobalState({ isAuthorized: false });
                }
              } else {
                localStorage.removeItem('accessToken');
                setGlobalState({ isAuthorized: false });
              }
            } catch (refreshError) {
              localStorage.removeItem('accessToken');
              setGlobalState({ isAuthorized: false });
            }
          } else {
            localStorage.removeItem('accessToken');
            setGlobalState({ isAuthorized: false });
          }
        } catch (error) {
          console.error('Error during authentication check:', error);
          localStorage.removeItem('accessToken');
          setGlobalState({ isAuthorized: false });
        }
      } else {
        setGlobalState({ isAuthorized: false });
      }
    };
    
    void checkAuth();
  }, [setGlobalState]);
  
  useEffect(() => {
    const allowedPaths = ['/', '/register'];
    if (!isAuthorized && !allowedPaths.includes(location.pathname)) {
      navigate('/');
    } else if (isAuthorized && location.pathname === '/') {
      navigate('/users');
    }
  }, [isAuthorized, location, navigate]);
  
  const contextValue = useMemo(
    () => ({ isAuthorized, setIsAuthorized, users, setGlobalState }),
    [isAuthorized, setIsAuthorized, users, setGlobalState]
  );
  
  return (
    <globalContext.Provider value={contextValue}>
      <Outlet />
    </globalContext.Provider>
  );
}

export { ErrorBoundary };


