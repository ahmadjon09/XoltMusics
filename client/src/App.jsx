import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'

import { Root } from './layout/Root'
import { Loading } from './components/Loading'
import { Home } from './pages/Home'
import Fetch from './hooks/fetcher'
import { ContextData } from './context/Context'
import { ErrorPage } from './pages/Error'
import { TopTracks } from './pages/TopTracks'
import { SearchPage } from './pages/Search'
import { Login } from './pages/Login'
import { Register } from './pages/Register'



export default function App() {
  const { setUser, netErr } = useContext(ContextData)
  const [isLoading, setIsLoading] = useState(true)

  const token = Cookies.get('user_token')
  // useEffect(() => {
  //   const handleBeforeUnload = (e) => {
  //     e.preventDefault();
  //     e.returnValue = "";
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);


  useEffect(() => {
    const getProfile = async () => {
      if (!token) {
        setUser(null)
        setIsLoading(false)
        return
      }

      try {
        const response = await Fetch.get('/users/profile')

        if (response.data?.user) {
          setUser(response.data.user)
        } else {
          Cookies.remove('user_token')
          setUser(null)
        }

      } catch (error) {
        console.error('Profile fetch error:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    getProfile()
  }, [token, setUser])

  if (netErr) return <ErrorPage />

  if (isLoading) return <Loading />

  const routes = [
    { index: true, element: <Home /> },
    { path: 'top-tracks', element: <TopTracks /> },
    { path: 'search', element: <SearchPage /> },
    { path: 'login', element: <Login /> },
    { path: 'register', element: <Register /> },

    { path: '*', element: <ErrorPage /> }
  ].filter(Boolean)

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: routes,
      errorElement: <ErrorPage />
    }
  ])

  return <RouterProvider router={router} />
}
