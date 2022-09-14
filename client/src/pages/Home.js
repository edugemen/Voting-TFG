import React, { useEffect, useState } from "react";
import { getPartiesFromUser } from "../utils/party";

function Home(props) {
    const [parties, setParties] = useState([]);

    useEffect(() => {
        getPartiesFromUser().then((result) => {
            setParties(result);
        });
    }, []);

    if (parties.length > 0) {
        //Devuelve una lista de partidos que si clickas te lleva a la pagina de ese partido
        return (
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-300">
                    Parties
                </h1>
                <ul className="flex flex-col items-center">
                    {parties.map((party, i) => (
                        <li key={i}>
                            <a href={`/party/${party}`}>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-300">
                                    {party}
                                </h2>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        );
    } else {
        return <div>No parties found</div>;
    }
}

export default Home;
