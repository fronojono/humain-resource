export const isAuthenticated = () => {
    if (typeof window === "undefined") {
        return false
    }

    if (localStorage.getItem("users")) {
        return JSON.parse(localStorage.getItem("users"));
    } else {
        return false
    }
};
