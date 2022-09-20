//Get ballots from backend with fetch and 10 in params
export function getBallots() {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:3005/ballots/10`)
            .then((res) => res.json())
            .then((data) => resolve(data))
            .catch((err) => reject(err));
    });
}
