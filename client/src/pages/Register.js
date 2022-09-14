import React from "react";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../components/LoadingButton";
import { registerAccount } from "../utils/auth";

function isValidDNI(dni) {
    let numero = dni.substr(0, dni.length - 1);
    let letra = dni.substr(dni.length - 1, 1).toUpperCase();
    let letras = "TRWAGMYFPDXBNJZSQVHLCKET";
    let posicion = numero % 23;
    let letraCalculada = letras.charAt(posicion);
    return letra === letraCalculada;
}

function formatDNI(dni) {
    if (dni.length === 9 && isValidDNI(dni)) {
        return dni.substring(0, 8);
    } else {
        return "";
    }
}

function Register(props) {
    let navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);

    const handleDniChange = (e) => {
        e.preventDefault();
        let dni = formatDNI(e.target[0].value);

        if (dni !== "") {
            setLoading(true);
            registerAccount(dni)
                .then((res) => {
                    setLoading(false);
                    if (res) {
                        navigate("/");
                    }
                })
                .catch((err) => {
                    setLoading(false);
                });
        }
    };

    return (
        <div className="w-full max-w-xs m-auto p-2">
            <form
                className="overflow-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                onSubmit={handleDniChange}
            >
                <p className="text-gray-700 text-md font-bold text-left">
                    ¡Bienvenido a VoteChain!
                </p>
                <p className="text-gray-700 text-md font-bold text-left">
                    Para poder acceder a la aplicacion, necesitamos que nos
                    facilites tu DNI.
                </p>
                <div className="mb-4 mt-4">
                    <label
                        className="float-left block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="dni"
                    >
                        DNI
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="dni"
                        type="text"
                        placeholder="00000000A"
                    />
                </div>
                <div className="relative">
                    <LoadingButton
                        isLoading={loading}
                        message="Registro"
                        style="float-right"
                    />
                </div>
            </form>
        </div>
    );
}

export default Register;
