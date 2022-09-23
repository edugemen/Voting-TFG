import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../components/LoadingButton";
import { createBallot } from "../utils/admin";

function CreateBallot(props) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleBallotCreate = (e) => {
        e.preventDefault();
        setLoading(true);
        createBallot(e.target[0].value, e.target[1].value.split("\n")).then(
            (res) => {
                setLoading(false);
                if (res) {
                    navigate("/vote/" + res);
                }
            }
        );
    };

    return (
        <div className="w-full p-2">
            <form
                className="overflow-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                onSubmit={handleBallotCreate}
            >
                <div className="mb-4">
                    <label
                        className="float-left block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="dni"
                    >
                        Pregunta
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="dni"
                        type="text"
                    />
                </div>
                <div className="mb-4">
                    <label
                        for="message"
                        class="float-left block mb-2 text-sm font-bold text-gray-700 text-left"
                    >
                        Introduce las opciones de voto (una por línea)
                    </label>
                    <textarea
                        id="message"
                        rows="4"
                        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder={"Opcion 1\nOpcion 2\nOpcion 3"}
                    ></textarea>
                </div>
                <div className="relative">
                    <LoadingButton
                        message="Crear votación"
                        isLoading={loading}
                        style="float-right"
                    />
                </div>
            </form>
        </div>
    );
}

export default CreateBallot;
