import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBallot, getBallotList } from "../utils/admin";

function Admin(props) {
    const [ballotList, setBallotList] = useState([]);
    const navigate = useNavigate();
    console.log("Hola soy Admin");

    useEffect(() => {
        getBallots();
    }, []);

    const handleBallotCreate = (e) => {
        e.preventDefault();
        console.log(e.target[0].value);
        console.log(e.target[1].value);
        createBallot(e.target[0].value, e.target[1].value.split("\n")).then(
            (res) => {
                if (res) {
                    console.log("Ballot created");
                    navigate("/vote/" + res);
                }
            }
        );
    };

    const getBallots = () => {
        getBallotList().then((res) => {
            console.log(res);
            setBallotList(res);
        });
    };

    const list_show = () => {
        if (ballotList.length > 0) {
            return (
                <div className="flex flex-col justify-center items-center">
                    {ballotList
                        .map((ballot, i) => {
                            return (
                                <div
                                    key={i}
                                    className="flex flex-col justify-center items-center m-2 p-2 shadow-lg rounded w-full bg-white"
                                    onClick={() =>
                                        navigate(`/vote/${ballot.address}`)
                                    }
                                >
                                    <p className="text-xl text-left">
                                        {ballot.question}
                                    </p>
                                </div>
                            );
                        })
                        .reverse()}
                </div>
            );
        } else {
            return (
                <div className="flex flex-col justify-center items-center">
                    <p className="text-xl text-left">No hay votaciones</p>
                </div>
            );
        }
    };

    return (
        <div className="w-full max-w-xs m-auto">
            {list_show()}
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
                        placeholder="00000000A"
                    />
                </div>
                <div className="mb-4">
                    <label
                        for="message"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                    >
                        Introduce las opciones de voto
                    </label>
                    <textarea
                        id="message"
                        rows="4"
                        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Your message..."
                    ></textarea>
                </div>
                <div className="relative">
                    <button
                        className="float-right rigth-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Sumbit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Admin;
