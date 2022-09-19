import "./App.css";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import { AccountWatcher } from "./utils/protectRoutes";
import Vote from "./pages/Vote";
import CreateParty from "./pages/CreateParty";
import Party from "./pages/Party";
import CreateBallot from "./pages/CreateBallot";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route
                    path="/"
                    element={
                        <AccountWatcher>
                            <Home />
                        </AccountWatcher>
                    }
                ></Route>
                <Route path="vote">
                    <Route
                        path=":id"
                        element={
                            <AccountWatcher>
                                <Vote />
                            </AccountWatcher>
                        }
                    ></Route>
                </Route>
                <Route path="party">
                    <Route
                        path=":id"
                        element={
                            <AccountWatcher>
                                <Party />
                            </AccountWatcher>
                        }
                    ></Route>
                </Route>
                <Route
                    path="/createParty"
                    element={
                        <AccountWatcher>
                            <CreateParty />
                        </AccountWatcher>
                    }
                />
                <Route
                    path="/createBallot"
                    element={
                        <AccountWatcher>
                            <CreateBallot />
                        </AccountWatcher>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <AccountWatcher>
                            <Register />
                        </AccountWatcher>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
