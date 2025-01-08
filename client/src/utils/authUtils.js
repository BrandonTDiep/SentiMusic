export const isUserAuthenticated = () => {
    const accessToken = localStorage.getItem("accessToken")
    const expirationTime = localStorage.getItem("expirationTime")

    return accessToken && new Date().getTime() < Number(expirationTime)
}