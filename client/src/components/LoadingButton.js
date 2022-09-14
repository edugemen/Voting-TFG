import React from "react";

function LoadingButton(props) {
    return (
        <button
            className={
                "h-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline " +
                props.style +
                (props.isLoading ? " opacity-50 cursor-not-allowed" : "")
            }
            type="sumbit"
        >
            {props.isLoading ? (
                <img src="loading.svg" className="h-full m-auto" />
            ) : (
                props.message
            )}
        </button>
    );
}

export default LoadingButton;
