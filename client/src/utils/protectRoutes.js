import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { isAccountRegistered } from "./auth";
import { getWeb3 } from "./metamask";

export const AdminRoute = ({ children }) => {
    // let navigate = useNavigate();

    // useEffect(() => {
    //     isA;
    //     if (!isAdmin) {
    //         navigate("/");
    //     }
    // }, []);

    return children;
};

export const AccountWatcher = ({ children }) => {
    let navigate = useNavigate();
    const [completed, setCompleted] = useState(false);

    const init = async () => {
        await getWeb3();
        let userAccount = localStorage.getItem("userAccount");

        let registered = await isAccountRegistered(userAccount);
        console.log("Esta registrado:", registered);
        if (!registered) {
            navigate("/register");
        }
        setCompleted(true);
    };

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        window.ethereum.on("accountsChanged", async function (accounts) {
            await init();
        });
    }, []);

    if (completed) {
        return (
            <div className="w-full h-full">
                <Navbar></Navbar>
                <div className="w-100">{children}</div>
            </div>
        );
    }
};
