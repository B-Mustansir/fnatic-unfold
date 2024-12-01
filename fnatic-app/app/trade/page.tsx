'use client'

import { toEther, toWei, useAddress, useBalance, useContract, useContractRead, useContractWrite, useSDK, useTokenBalance } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import SwapInput from "../../components/swap-input";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ArrowDownUp } from "lucide-react"

export default function Trade() {

    const TOKEN_CONTRACT = "<YOUR_CONTRACT>";
    const DEX_CONTRACT = "<YOUR_CONTRACT>";

    const sdk = useSDK();
    const address = useAddress();
    const { contract: tokenContract } = useContract(TOKEN_CONTRACT);
    const { contract: dexContract } = useContract(DEX_CONTRACT);
    const { data: symbol } = useContractRead(tokenContract, "symbol");
    const { data: tokenBalance } = useTokenBalance(tokenContract, address);
    const { data: nativeBalance } = useBalance();
    const { data: contractTokenBalance } = useTokenBalance(tokenContract, DEX_CONTRACT);

    const [contractBalance, setContractBalance] = useState<String>("0");
    const [nativeValue, setNativeValue] = useState<String>("0");
    const [tokenValue, setTokenValue] = useState<String>("0");
    const [currentFrom, setCurrentFrom] = useState<String>("native");
    const [isLoading, setIsLoading] = useState<Boolean>(false);

    const { mutateAsync: swapNativeToken } = useContractWrite(dexContract, "swapEthTotoken");
    const { mutateAsync: swapTokenToNative } = useContractWrite(dexContract, "swapTokenToEth");
    const { mutateAsync: approveTokenSpending } = useContractWrite(tokenContract, "approve");

    const { data: amountToGet } = useContractRead(
        dexContract,
        "getAmountOfTokens",
        currentFrom === "native"
            ? [toWei(nativeValue as string || "0"), toWei(contractBalance as string || "0"), contractTokenBalance?.value]
            : [toWei(tokenValue as string || "0"), contractTokenBalance?.value, toWei(contractBalance as string || "0")]
    );

    const fetchContractBalance = async () => {
        try {
            const balance = await sdk?.getBalance(DEX_CONTRACT);
            setContractBalance(balance?.displayValue || "0");
        } catch (error) {
            console.error(error);
        }
    };

    const executeSwap = async () => {
        setIsLoading(true);
        try {
            if (currentFrom === "native") {
                await swapNativeToken({ overrides: { value: toWei(nativeValue as string || "0") } });
            } else {
                await approveTokenSpending({ args: [DEX_CONTRACT, toWei(tokenValue as string || "0")] });
                await swapTokenToNative({ args: [toWei(tokenValue as string || "0")] });
            }
            alert("Swap executed successfully");
        } catch (error) {
            console.error(error);
            alert("An error occurred while trying to execute the swap");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchContractBalance();
        const interval = setInterval(fetchContractBalance, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!amountToGet) return;
        if (currentFrom === "native") {
            setTokenValue(toEther(amountToGet));
        } else {
            setNativeValue(toEther(amountToGet));
        }
    }, [amountToGet, currentFrom]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-white text-center">Swap anytime, anywhere.</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <SwapInput
                        current={currentFrom as string}
                        type="native"
                        max={nativeBalance?.displayValue}
                        value={nativeValue as string}
                        setValue={setNativeValue}
                        tokenSymbol="ETH"
                        tokenBalance={nativeBalance?.displayValue}
                    />
                    <div className="flex justify-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCurrentFrom(currentFrom === "native" ? "token" : "native")}
                            className="rounded-full bg-gray-700 hover:bg-gray-600 text-white"
                        >
                            <ArrowDownUp className="h-4 w-4" />
                        </Button>
                    </div>
                    <SwapInput
                        current={currentFrom as string}
                        type="token"
                        max={tokenBalance?.displayValue}
                        value={tokenValue as string}
                        setValue={setTokenValue}
                        tokenSymbol={symbol as string}
                        tokenBalance={tokenBalance?.displayValue}
                    />
                    {address ? (
                        <Button
                            onClick={executeSwap}
                            disabled={isLoading as boolean}
                            className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Loading..." : "Swap Now"}
                        </Button>
                    ) : (
                        <p className="text-white text-center mt-6">Connect wallet to exchange.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}