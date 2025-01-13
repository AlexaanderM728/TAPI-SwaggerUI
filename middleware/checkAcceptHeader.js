const checkAcceptHeader = (req, res, next) => {
    // Sprawdź, czy ścieżka zawiera '/api-docs'
    if (req.path.startsWith('/api-docs')) {
        return next(); // Przepuść zapytanie
    }

    const acceptHeader = req.headers['accept'];

    // Sprawdź, czy nagłówek 'Accept' zawiera 'application/json'
    if (!acceptHeader || !acceptHeader.includes('application/json')) {
        return res.status(406).json({
            error: "Not Acceptable",
            message: "Nagłówek 'Accept' musi być ustawiony na 'application/json'."
        });
    }

    next(); // Przejdź do kolejnego middleware lub obsługi trasy
};

export default checkAcceptHeader;