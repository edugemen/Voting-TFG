import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../components/LoadingButton";
import { createParty } from "../utils/party";

function CreateParty(props) {
    let navigate = useNavigate();
    let [loading, setLoading] = useState(false);

    const submitHandler = (e) => {
        e.preventDefault();
        let name = e.target.partyName.value;
        let description = e.target.partyDescription.value;
        setLoading(true);
        createParty(name, description).then((result) => {
            setLoading(false);
            let partyAddress = result.options.address;
            navigate(`/party/${partyAddress}`);
        });
    };

    return (
        <div className="w-full max-w-xs m-auto p-2">
            <form
                onSubmit={submitHandler}
                className="overflow-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            >
                <p className="text-xl font-semibold text-left mb-2">
                    Rellena los campos para crear tu partido.
                </p>
                <div className="mb-2">
                    <label
                        htmlFor="partyName"
                        className="text-gray-700 float-left"
                    >
                        Nombre del partido
                    </label>
                    <input
                        type="text"
                        id="partyName"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="partyDescription"
                        className="text-gray-700 float-left"
                    >
                        Descripción del partido
                    </label>
                    <textarea
                        rows={4}
                        id="partyDescription"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500"
                    />
                </div>
                <div className="relative">
                    <LoadingButton
                        isLoading={loading}
                        message="Crear partido"
                        style="float-right"
                    />
                </div>
            </form>
        </div>
    );
}

export default CreateParty;
