export const isUserAuthenticated = () => {
    const accessToken = localStorage.getItem("accessToken")
    const expirationTime = localStorage.getItem("expirationTime")

    return accessToken && new Date().getTime() < Number(expirationTime)
}

export const getRemainingTokenTime = () => {
    const expirationTime = localStorage.getItem("expirationTime");
    if (!expirationTime) return 0;
    return Number(expirationTime) - new Date().getTime();
};
