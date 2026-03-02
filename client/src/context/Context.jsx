import { createContext, useState } from 'react'
import Cookies from 'js-cookie'
export const ContextData = createContext()

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState({})
    const [netErr, setNetErr] = useState(false)
    const [isAuth, setIsAuth] = useState(() => !!Cookies.get('user_token'))
    const [login, setLogin] = useState(false)
    const [loginState, setLoginState] = useState(false)
    const setUserToken = token => {
        Cookies.set('user_token', token, { expires: 7 })
        localStorage.setItem('is_auth', 'true')
        setIsAuth(true)
    }

    const removeUserToken = () => {
        Cookies.remove('user_token')
        localStorage.removeItem('is_auth')
        setIsAuth(false)
    }
    const onClose = () => {
        setLogin(false)
        setLoginState("login")
    }
    return (
        <ContextData.Provider
            value={{
                setUserToken,
                removeUserToken,
                setUser,
                user,
                netErr,
                setNetErr,
                isAuth,
                setIsAuth,
                login,
                setLogin,
                loginState,
                setLoginState,
                onClose,
            }}
        >
            {children}
        </ContextData.Provider>
    )
}
