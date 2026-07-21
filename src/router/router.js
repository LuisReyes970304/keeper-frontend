export const registerRoutes = (
    inicio,
    login,
    usuario,
    admin,
    policia,
    bombero,
    ambulancia
) => ({
    "/": inicio,
    "/login": login,
    "/usuario": usuario,
    "/admin": admin,
    "/policia": policia,
    "/bombero": bombero,
    "/ambulancia": ambulancia,
});


function getUsuario() {
    const usuario = sessionStorage.getItem("usuarioLogueado");
    return usuario ? JSON.parse(usuario) : null;
}

function isAuthenticated() {
    return getUsuario() !== null;
}


const routePermissions = {
    "/usuario": "Ciudadano",
    "/admin": "Administrador",
    "/policia": "Policía",
    "/bombero": "Bomberos",
    "/ambulancia": "Ambulancia",
};


export async function navigateTo(path, event, callback) {
    event?.preventDefault();

    const usuario = getUsuario();

    if (routePermissions[path]) {

        if (!usuario) {
            path = "/login";
        }

        else if (usuario.rol !== routePermissions[path]) {
            path = "/";
        }
    }

    window.history.pushState({}, "", path);

    if (typeof callback === "function") {
        await callback();
    }

    window.dispatchEvent(new PopStateEvent("popstate"));
}

export async function renderCurrentRoute(routeMap, element) {

    const currentPath = window.location.pathname;
    const container = document.querySelector(element);

    const usuario = getUsuario();

    // Si intenta entrar a una ruta protegida
    if (routePermissions[currentPath]) {

        if (!usuario) {
            window.history.replaceState({}, "", "/login");
            return renderCurrentRoute(routeMap, element);
        }

        // No tiene permisos
        if (usuario.rol !== routePermissions[currentPath]) {
            window.history.replaceState({}, "", "/");
            return renderCurrentRoute(routeMap, element);
        }
    }

    const view = routeMap[currentPath] || routeMap["/"];

    container.innerHTML =
        typeof view === "function"
            ? await view()
            : view;
}
