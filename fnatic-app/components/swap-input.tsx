import React from "react";

type Props = {
    type: "native" | "token";
    tokenSymbol?: string;
    tokenBalance?: string;
    current: string;
    setValue: (value: string) => void;
    max?: string;
    value: string;
};

export default function SwapInput({
    type,
    tokenSymbol,
    tokenBalance,
    setValue,
    value,
    current,
    max,
}: Props) {
    const truncate = (value: string) => {
        if (value === undefined) return;
        if (value.length > 5) {
            return value.slice(0, 5);
        }
        return value;
    };

    return (
        <div className="relative bg-gray-700 rounded-lg p-4">
            <input
                type="number"
                placeholder="0.0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={current !== type}
                className="w-3/5 h-12 bg-transparent text-2xl text-white outline-none overflow-y-scroll no-scrollbar"
            />
            <div className="absolute top-2 right-2 text-right">
                <p className="text-sm text-gray-300 mb-1">{tokenSymbol}</p>
                <p className="text-xs text-gray-400">Balance: {truncate(tokenBalance as string)}</p>
                {current === type && (
                    <button
                        onClick={() => setValue(max || "0")}
                        className="text-xs text-purple-400 hover:text-purple-300 mt-1"
                    >
                        Max
                    </button>
                )}
            </div>
        </div>

    )
}