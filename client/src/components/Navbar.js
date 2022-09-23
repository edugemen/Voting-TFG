import React, { useEffect, useRef, useState } from "react";
import { getWeb3 } from "../utils/metamask";
import jazzicon from "@metamask/jazzicon";
import { useNavigate } from "react-router-dom";

function Navbar(props) {
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const userLogo = useRef();
    const navigate = useNavigate();

    const setData = (account) => {
        setUser(account);

        const element = userLogo.current;

        const addr = account.slice(2, 10);
        const seed = parseInt(addr, 16);
        const icon = jazzicon(50, seed); //generates a size 20 icon
        icon.style.display = null;
        icon.style.border = "3px solid #111827";
        if (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        element.appendChild(icon);
    };

    useEffect(() => {
        let account = localStorage.getItem("userAccount");
        setData(account);

        window.ethereum.on("accountsChanged", async function (accounts) {
            setData(accounts[0]);
        });
    }, []);

    return (
        <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 bg-gray-900 w-full">
            <div className="flex place-content-between w-full">
                <div className="flex items-center">
                    <a
                        href="/"
                        className="text-2xl font-bold text-white ml-3 mr-5"
                    >
                        <h1>VotingApp</h1>
                    </a>
                </div>
                <div
                    id="user_show"
                    className={
                        "bg-blue-100 rounded px-3 py-2 relative w-44 sm:w-96 md:w-auto" +
                        (showDropdown
                            ? " overflow-visible block"
                            : " overflow-hidden inline-block")
                    }
                    onClick={() => setShowDropdown(!showDropdown)}
                    onMouseEnter={() => setShowDropdown(true)}
                    onMouseLeave={() => setShowDropdown(false)}
                >
                    <div className="flex items-center overflow-hidden">
                        <h1 className="mr-2 font-semibold font-sans text-lg truncate">
                            {user}
                        </h1>
                        <div ref={userLogo} className="content-end" />
                    </div>
                    <div
                        className={
                            (showDropdown ? "block " : "hidden ") +
                            "absolute z-10 w-full flex justify-end"
                        }
                    >
                        <div className="rounded bg-blue-100 p-1 mr-3 left-0">
                            <div
                                className="rounded hover:bg-blue-200 p-3"
                                onClick={() => {
                                    navigate("/createParty");
                                }}
                            >
                                <p className="text-left mb-2">
                                    Crear un partido
                                </p>
                            </div>
                            <div
                                className="rounded hover:bg-blue-200 p-3"
                                onClick={() => {
                                    navigate("/createBallot");
                                }}
                            >
                                <p className="text-left">Crear una votación</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
