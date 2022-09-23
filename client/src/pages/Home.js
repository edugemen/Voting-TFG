import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBallots } from "../utils/home";
import { getPartiesFromUser, getParty } from "../utils/party";

function Home(props) {
    let navigate = useNavigate();
    const [parties, setParties] = useState([]);
    const [ballots, setBallots] = useState([]);

    useEffect(() => {
        getPartiesFromUser().then((result) => {
            let promises = result.map((party) => {
                return getParty(party);
            });

            Promise.all(promises).then((pl) => {
                setParties(pl);
            });
        });
        getBallots().then((result) => {
            let list = result.map((ballot) => {
                let seconds = secondsBetween(new Date(), ballot.timestamp);
                let minutes = Math.floor(seconds / 60);
                let hours = Math.floor(minutes / 60);
                let days = Math.floor(hours / 24);
                let time = "Hace ";
                if (days > 0) {
                    time += days + "d";
                } else if (hours > 0) {
                    time += hours + "h";
                } else if (minutes > 0) {
                    time += minutes + "m";
                } else {
                    time += seconds + "s";
                }

                ballot.timestamp = time;
                return ballot;
            });
            setBallots(list.reverse());
        });
    }, []);

    //Seconds between two timestamps
    function secondsBetween(timestamp1, timestamp2) {
        return Math.floor(Math.abs(timestamp1 - timestamp2) / 1000);
    }

    return (
        <div className="xl:flex w-full">
            <div className="w-full p-3">
                <p className="text-3xl font-semibold text-left mb-2">
                    Últimas votaciones
                </p>
                {ballots.map((ballot, i) => (
                    <div
                        key={i}
                        className="rounded bg-white mb-3 p-3 flex justify-between w-full cursor-pointer"
                        onClick={() => {
                            navigate(`/vote/${ballot.address}`);
                        }}
                    >
                        <p className="text-lg font-semibold truncate">
                            {ballot.question}
                        </p>
                        <p className="text-base text-slate-600">
                            {ballot.timestamp}
                        </p>
                    </div>
                ))}
            </div>
            <div>
                <div className="w-full p-3">
                    <p className="text-3xl font-semibold text-left mb-2">
                        Buscar votación
                    </p>
                    <div className="rounded bg-white w-full p-3">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                navigate(`/vote/${e.target[0].value}`);
                            }}
                        >
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2 text-left ml-2"
                                htmlFor="ballotAddress"
                            >
                                Dirección de la votación
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="ballotAddress"
                                type="text"
                                placeholder="0x..."
                            />
                            <div className="flex justify-end pt-3">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="sumbit"
                                >
                                    Buscar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="w-full p-3">
                    <p className="text-3xl font-semibold text-left mb-2">
                        Tus partidos
                    </p>
                    {parties.length > 0 ? (
                        <div className="w-full">
                            {parties.map((party, i) => (
                                <div
                                    key={i}
                                    className="rounded bg-white p-3 mb-3 flex justify-between w-full cursor-pointer"
                                    onClick={() => {
                                        navigate(`/party/${party.address}`);
                                    }}
                                >
                                    <p className="text-lg font-semibold">
                                        {party.name}
                                    </p>
                                    <p className="text-base text-slate-600 truncate ml-20">
                                        {party.address}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded bg-white w-full p-3">
                            <p className="text-lg font-semibold text-center">
                                No tienes ningún partido
                            </p>
                        </div>
                    )}
                </div>
                <div className="w-full p-3">
                    <p className="text-3xl font-semibold text-left mb-2">
                        Buscar un partido
                    </p>
                    <div className="rounded bg-white w-full p-3">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                navigate(`/party/${e.target[0].value}`);
                            }}
                        >
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2 text-left ml-2"
                                htmlFor="partyAddress"
                            >
                                Dirección del partido
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="partyAddress"
                                type="text"
                                placeholder="0x..."
                            />
                            <div className="flex justify-end pt-3">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="submit"
                                >
                                    Buscar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
