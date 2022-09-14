import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
    checkPartyOwner,
    getPartiesFromUser,
    getParty,
    getPartyVotes,
} from "../utils/party";
import {
    getBallotData,
    getFinalVotes,
    securePartyVote,
    secureVote,
} from "../utils/vote";
import jazzicon from "@metamask/jazzicon";
import Cookies from "universal-cookie";
import { PieChart } from "react-minimal-pie-chart";
import LoadingButton from "../components/LoadingButton";

function Vote(props) {
    let navigate = useNavigate();
    let { id } = useParams();
    const [ballotData, setBallotData] = useState(null);
    const [selectedParty, setSelectedParty] = useState(null);
    const [partyFavList, setPartyFavList] = useState([]);
    const [partyVoteList, setPartyVoteList] = useState([]);
    const [secondsRemaining, setSecondsRemaining] = useState(0);
    const [partyVoteActive, setPartyVoteActive] = useState(false);
    const [pieChartData, setPieChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [myParties, setMyParties] = useState([]);
    const [hideParties, setHideParties] = useState(true);

    //
    // const [partyAddress, setPartyAddress] = useState(null);
    // const [partyData, setPartyData] = useState(null);
    //
    // const [partyVotes, setPartyVotes] = useState([]);

    const getPieChartData = async () => {
        console.log("getPieChartData");
        if (ballotData && ballotData.length > 0 && ballotData[2] == 3) {
            getFinalVotes(id).then((res) => {
                let suma = res.reduce((a, b) => a + b, 0);
                if (suma > 0) {
                    let v = res.map((number, i) => {
                        return {
                            title: ballotData[1][i],
                            value: number / suma,
                            color:
                                "#" +
                                Math.floor(Math.random() * 16777215).toString(
                                    16
                                ),
                        };
                    });
                    v = v.filter((item) => item.value > 0);
                    setPieChartData(v);
                } else {
                    setPieChartData(null);
                }
            });
        }
    };

    useEffect(() => {
        const cookies = new Cookies();
        let pvl = cookies.get("partyFavList");
        console.log("pvl", pvl);
        if (pvl) {
            setPartyFavList(pvl);
        }
        getPartiesFromUser().then((res) => {
            res = res.map((item) => {
                console.log("item", item);
                return getParty(item);
            });
            console.log("res", res);
            Promise.all(res).then((res) => {
                setMyParties(res);
            });
        });
        // } else {
        //     let parties = ["0xb9AF5eb1Ef2f7a663f1f1C41A3b10d512c5599aA"];
        //     parties = parties.map((party) => {
        //         return getParty(party);
        //     });
        //     Promise.all(parties).then((parties_res) => {
        //         setPartyFavList(parties_res);
        //     });
        // }
    }, []);

    useEffect(() => {
        console.log("myParties", myParties);
    }, [myParties]);

    useEffect(() => {
        if (ballotData && partyFavList && partyFavList.length > 0) {
            getPartyVotes(
                partyFavList.map((party) => party.address),
                id
            ).then((result) => {
                if (result) {
                    let pv = [];
                    for (let i = 0; i < ballotData[1].length; i++) {
                        pv.push([]);
                    }
                    for (let i = 0; i < result.length; i++) {
                        let option = result[i];
                        if (option >= 0) {
                            pv[option].push(partyFavList[i]);
                        }
                    }
                    setPartyVoteList(pv);
                }
            });
        }
        getPieChartData();
    }, [ballotData, partyFavList]);

    useEffect(() => {
        getBallotData(id).then((result) => {
            setBallotData(result);
            let timer = result[3];
            let interval = setInterval(() => {
                timer--;
                setSecondsRemaining(timer);
                if (timer === 0) {
                    clearInterval(interval);
                    window.location.reload(false);
                }
            }, 1000);
        });
    }, [id]);

    useEffect(() => {
        if (partyVoteList && partyVoteList.length > 0) {
            //Show jazzicon for each party
            for (let i = 0; i < partyVoteList.length; i++) {
                for (let j = 0; j < partyVoteList[i].length; j++) {
                    let partyIcon = document.getElementById(
                        "partyIcon" + i + j
                    );
                    if (partyIcon) {
                        const addr = partyVoteList[i][j].address.slice(2, 10);
                        const seed = parseInt(addr, 16);
                        const icon = jazzicon(20, seed); //generates a size 20 icon
                        if (partyIcon.firstChild) {
                            partyIcon.removeChild(partyIcon.firstChild);
                        }
                        partyIcon.appendChild(icon);
                    }
                }
            }
        }
    }, [partyVoteList]);

    function isChecked(e, id) {
        return e.target[id].checked;
    }

    const submitHandler = (e) => {
        e.preventDefault();
        ballotData[1].find((_, index) => {
            if (isChecked(e, index)) {
                console.log(index);
                if (selectedParty) {
                    setIsLoading(true);
                    securePartyVote(id, selectedParty.address, index).then(
                        (result) => {
                            setIsLoading(false);
                            console.log(result);
                        }
                    );
                } else {
                    setIsLoading(true);
                    secureVote(id, index).then((result) => {
                        setIsLoading(false);
                        console.log(result);
                    });
                }
            }
        });
    };

    const partyDropDown = () => {
        return (
            <div className="mt-3">
                <div
                    id="dropdown"
                    class="z-10 w-full bg-white rounded divide-y divide-gray-100 shadow"
                >
                    <ul
                        class="py-1 text-sm text-gray-700"
                        aria-labelledby="dropdownDefault"
                    >
                        {myParties.length > 0 ? (
                            myParties.map((party, index) => {
                                return (
                                    <li>
                                        <a
                                            class="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
                                            onClick={() => {
                                                setSelectedParty(party);
                                            }}
                                        >
                                            {party.name}
                                        </a>
                                    </li>
                                );
                            })
                        ) : (
                            <li>
                                <a class="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600">
                                    No Parties
                                </a>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        );
    };

    const voteInput = (disabl, option, index) => {
        return (
            <div key={"div" + index} className="flex items-center mb-4 px-6">
                <input
                    disabled={disabl}
                    id={"default-radio-" + index}
                    type="radio"
                    value=""
                    name="default-radio"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                    htmlFor={"default-radio-" + index}
                    className="ml-2 text-md font-semibold text-gray-900 w-full"
                >
                    <div className="flex place-content-between">
                        <p>{option}</p>
                        {partyVoteList && partyVoteList.length > 0
                            ? partyVoteList[index].map((party, j) => {
                                  return (
                                      <div
                                          title={party.name}
                                          key={"p" + j}
                                          id={"partyIcon" + index + j}
                                          className="text-sm font-normal text-gray-600"
                                          onClick={() => {
                                              navigate(
                                                  "/party/" + party.address
                                              );
                                          }}
                                      ></div>
                                  );
                              })
                            : null}
                    </div>
                </label>
            </div>
        );
    };

    const radio_group = (enabled) => {
        return (
            <form onSubmit={submitHandler}>
                {ballotData[1].map((option, index) => {
                    return voteInput(!enabled, option, index);
                })}
                {ballotData &&
                ballotData.length > 0 &&
                (ballotData[2] == 1 || ballotData[2] == 2) ? (
                    <div className="flex">
                        <div className="grow"></div>
                        <LoadingButton
                            message="Votar"
                            isLoading={isLoading}
                            style="float-right"
                        />
                    </div>
                ) : null}
            </form>
        );
    };

    const showTimer = () => {
        if (ballotData && ballotData.length > 0) {
            if (ballotData[2] == 0) {
                return (
                    <div className="flex items-center justify-between">
                        <p className="text-gray-600 text-sm">
                            Periodo de deliberación
                        </p>
                        <p className="text-gray-600 text-sm">
                            {secondsRemaining} segundos
                        </p>
                    </div>
                );
            } else if (ballotData[2] == 1) {
                return (
                    <div className="flex items-center justify-between">
                        <p className="text-gray-600 text-sm">
                            Periodo de votación de partidos
                        </p>
                        <p className="text-gray-600 text-sm">
                            {secondsRemaining} segundos
                        </p>
                    </div>
                );
            } else if (ballotData[2] == 2) {
                return (
                    <div className="flex items-center justify-between">
                        <p className="text-gray-600 text-sm">
                            Periodo de votación en solitario
                        </p>
                        <p className="text-gray-600 text-sm">
                            {secondsRemaining} segundos
                        </p>
                    </div>
                );
            } else if (ballotData[2] == 3) {
                return (
                    <div className="flex items-center justify-between">
                        <p className="text-gray-600 text-sm">
                            Votación cerrada
                        </p>
                    </div>
                );
            }
        }
    };

    const partySelectionInput = () => {
        if (selectedParty) {
            return (
                <div className="flex justify-between items-center">
                    <p className="text-gray-900">
                        Ya has seleccionado a {selectedParty.name}
                    </p>
                </div>
            );
        } else {
            return (
                <div>
                    <p onClick={() => setPartyVoteActive(!partyVoteActive)}>
                        Tienes un partido? Click aqui para votar.
                    </p>
                    <div className={partyVoteActive ? "" : "hidden"}>
                        {partyDropDown()}
                    </div>
                </div>
            );
        }
    };

    const showPartyData = () => {
        if (selectedParty) {
            return (
                <div className="flex justify-between items-center">
                    <p className="text-gray-900">
                        {"Votando con: " + selectedParty.name}
                    </p>
                </div>
            );
        }
    };

    const showResults = () => {
        //Shows the number of votes for each option with the percentage of votes for each option and a pie chart with the percentage of votes for each option when the election is closed
        if (ballotData && ballotData.length > 0) {
            if (pieChartData) {
                return (
                    <div className="m-auto">
                        <PieChart
                            label={({ dataEntry }) => dataEntry.title}
                            labelStyle={{
                                fontSize: "0.3rem",
                                fontWeight: "bold",
                            }}
                            data={pieChartData}
                        ></PieChart>
                    </div>
                );
            } else {
                return <p>No ha habido votos</p>;
            }
        }
    };

    const voteCard = () => {
        if (ballotData) {
            return (
                <div className="shadow-lg p-3 w-full sm:w-1/2 xl:w-1/4 rounded bg-slate-50">
                    {showTimer()}
                    <h1 className="text-3xl font-semibold mb-5 m-3">
                        {ballotData[0]}
                    </h1>
                    {ballotData[2] != 3
                        ? radio_group(
                              (ballotData[2] == 1 && selectedParty) ||
                                  ballotData[2] == 2
                          )
                        : showResults()}
                    {ballotData[2] == 1 && !selectedParty
                        ? partySelectionInput()
                        : null}
                    {ballotData[2] == 1 && selectedParty
                        ? showPartyData()
                        : null}
                </div>
            );
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-3">
            {voteCard()}
        </div>
    );
}

export default Vote;
