import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
    checkPartyOwner,
    editParty,
    getParty,
    getPartyIn,
    joinParty,
} from "../utils/party";
import jazzicon from "@metamask/jazzicon";
import { BsBookmarkStar, BsBookmarkStarFill } from "react-icons/bs";
import { MdModeEdit } from "react-icons/md";
import LoadingButton from "../components/LoadingButton";
import { useCookies } from "react-cookie";

function Party(props) {
    let { id } = useParams();
    const [cookies, setCookies, removeCookies] = useCookies(["partyFavList"]);
    const [party, setParty] = useState(null);
    const [editing, setEditing] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isJoined, setIsJoined] = useState(false);
    const partyLogo = useRef();

    useEffect(() => {
        getParty(id).then((party) => {
            setParty(party);
        });
        checkPartyOwner(id).then((result) => {
            setIsOwner(result);
        });
        getPartyIn().then((result) => {
            if (result === id) {
                setIsJoined(true);
            } else {
                setIsJoined(false);
            }
        });
        let pvl = cookies.partyFavList;
        if (pvl) {
            if (pvl.some((p) => p.address === id)) {
                setIsBookmarked(true);
            } else {
                setIsBookmarked(false);
            }
        } else {
            setIsBookmarked(false);
        }
    }, [id]);

    useEffect(() => {
        if (party && !party.image) {
            const element = partyLogo.current;
            const addr = id.slice(2, 10);
            const seed = parseInt(addr, 16);
            const icon = jazzicon(250, seed); //generates a size 20 icon
            icon.style.display = null;
            icon.style.border = "3px solid #111827";
            if (element.firstChild) {
                element.removeChild(element.firstChild);
            }
            element.appendChild(icon);
        }
    }, [party]);

    const handleBookmark = () => {
        if (party) {
            if (isBookmarked) {
                let pvl = cookies.partyFavList;
                if (pvl) {
                    pvl = pvl.filter((p) => p.address !== party.address);
                    setCookies("partyFavList", pvl, {
                        path: "/",
                    });
                }
                setIsBookmarked(false);
            } else {
                let pvl = cookies.partyFavList;
                if (pvl) {
                    pvl.push(party);
                    setCookies("partyFavList", pvl, { path: "/" });
                } else {
                    setCookies("partyFavList", [party], { path: "/" });
                }
                setIsBookmarked(true);
            }
        }
    };

    const handleJoin = (e) => {
        e.preventDefault();
        if (isJoined) {
            joinParty("0x0000000000000000000000000000000000000000").then(
                (result) => {
                    setIsJoined(false);
                    let p = party;
                    p.numberOfMembers = p.numberOfMembers - 1;
                    setParty(p);
                }
            );
        } else {
            joinParty(id).then((result) => {
                setIsJoined(true);
                let p = party;
                p.numberOfMembers = p.numberOfMembers + 1;
                setParty(p);
            });
        }
    };

    const handleEdit = (e) => {
        e.preventDefault();
        setEditing(!editing);
    };

    const handleEditForm = (e) => {
        e.preventDefault();
        let fields = [];
        let ids = [];

        for (let i = 0; i < e.target.length; i++) {
            if (e.target[i].value != "") {
                ids.push(i);
                fields.push(e.target[i].value);
            }
        }

        editParty(id, fields, ids).then((result) => {
            window.location.reload(false);
        });
    };

    const edit_modal = () => {
        return (
            <div
                id="edit-modal"
                tabIndex="-1"
                aria-hidden="true"
                className="overflow-y-auto overflow-x-hidden absolute flex flex-col justify-center items-center w-full z-50 mx-auto"
            >
                <div className="relative p-4 w-full h-full md:h-auto">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <button
                            type="button"
                            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                            onClick={handleEdit}
                        >
                            <svg
                                aria-hidden="true"
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="py-6 px-6 lg:px-8">
                            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                                Rellena los campos que quieras editar
                            </h3>
                            <form
                                className="space-y-6"
                                action="#"
                                onSubmit={handleEditForm}
                            >
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 text-left"
                                    >
                                        Nombre del partido
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="description"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 text-left"
                                    >
                                        Descripción
                                    </label>
                                    <input
                                        type="text"
                                        name="description"
                                        id="description"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="image"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 text-left"
                                    >
                                        URL de la imagen
                                    </label>
                                    <input
                                        type="text"
                                        name="image"
                                        id="image"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="https://www.partido.com/image.png"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="website"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 text-left"
                                    >
                                        Página web
                                    </label>
                                    <input
                                        type="text"
                                        name="website"
                                        id="website"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="https://www.partido.com"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 text-left"
                                    >
                                        Dirección de correo electrónico
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="partido@gmail.com"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="electoralProgram"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 text-left"
                                    >
                                        URL del programa electoral
                                    </label>
                                    <input
                                        type="text"
                                        name="electoralProgram"
                                        id="electoralProgram"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="https://www.partido.com/programa.pdf"
                                    />
                                </div>
                                <LoadingButton
                                    isLoading={loading}
                                    message="Editar"
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    //Shows the party details, on the left side is the party image, on the right side is the party name and description
    const partyShow = () => {
        if (party) {
            return (
                <div className="flex flex-wrap">
                    <div className="absolute w-full flex place-content-between">
                        {isOwner ? (
                            <MdModeEdit
                                onClick={handleEdit}
                                className="m-2 w-8 h-8"
                            />
                        ) : (
                            <br />
                        )}
                        {isBookmarked ? (
                            <BsBookmarkStarFill
                                onClick={handleBookmark}
                                className="m-2 w-8 h-8"
                            />
                        ) : (
                            <BsBookmarkStar
                                onClick={handleBookmark}
                                className="m-2 w-8 h-8"
                            />
                        )}
                    </div>
                    <div
                        className="w-full flex justify-center md-basis-1/3 p-2"
                        ref={partyLogo}
                    >
                        <img
                            src={party.image}
                            alt={party.name}
                            className="w-64"
                        />
                    </div>
                    <div className="w-full md-basis-1/3">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {party.name}
                        </h1>
                        <p className="text-xl font-bold text-gray-900">
                            {party.description}
                        </p>
                        {/* Show party number of members */}
                        <p className="text-xl font-bold text-gray-900">
                            {party.numberOfMembers}{" "}
                            {party.numberOfMembers == 1
                                ? "miembro"
                                : "miembros"}
                        </p>
                        <form onSubmit={handleJoin}>
                            <LoadingButton
                                isLoading={loading}
                                message={
                                    isJoined ? "Dejar el partido" : "Unirse"
                                }
                            />
                        </form>
                    </div>
                    <div>
                        {party.website ? (
                            <div>
                                <p className="text-left font-semibold">
                                    Web del partido
                                </p>
                                <a
                                    href={party.website}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <p className="text-left">{party.website}</p>
                                </a>
                            </div>
                        ) : null}
                        {party.email ? (
                            <div>
                                <p className="text-left font-semibold">
                                    Correo electrónico
                                </p>
                                <p className="text-left">{party.email}</p>
                            </div>
                        ) : null}
                        {party.electoralProgram ? (
                            <div>
                                <p className="text-left font-semibold">
                                    Programa electoral
                                </p>
                                <a
                                    href={party.electoralProgram}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <p className="text-left">
                                        {party.electoralProgram}
                                    </p>
                                </a>
                            </div>
                        ) : null}
                    </div>
                </div>
            );
        }
    };

    return (
        <div>
            {editing ? edit_modal() : null}
            {partyShow()}
        </div>
    );
}

export default Party;
