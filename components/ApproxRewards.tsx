import { useAddress } from "@thirdweb-dev/react";
import { SmartContract } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import ContractMappingResponse from "../types/ContractMappingResponse";

type Props = {
    miningContract: SmartContract<any>;
};

// This component gives a very rough estimation of how many tokens have been earned in the current session
// Assuming there is a block every 2.1 seconds on Polygon, and the rewards of gwei is 20_000_000 per block
// The total amount of tokens earned is:
// 10_000_000_000_000 * 2.1 * blocks_in_session
// This is a rough estimation of how many tokens have been earned in the current session

export default function ApproxRewards({ miningContract }: Props) {
    const address = useAddress();

    // We can kick off a timer when this component is mounted
    // Each 2.1 seconds, we can update the amount of tokens earned
    // This is a rough estimation of how many tokens have been earned in the current session

    const everyMillisecondAmount = parseInt(
        (10_000_000_000_000 / 2.1).toFixed(0)
    );

    const [amount, setAmount] = useState<number>(0);

    const [multiplier, setMultiplier] = useState<number>(0);

    useEffect(() => {
        (async () => {
            if (!address) return;

            const p = (await miningContract.call(
                "playerTool",
                address
            )) as ContractMappingResponse;

            if (p.isData) {
                setMultiplier(p.value.toNumber() + 1);
            } else {
                setMultiplier(0);
            }
        })();
    }, [address, miningContract]);

    useEffect(() => {
        // set interval counter
        const interval = setInterval(() => {
            // update the amount of tokens earned
            setAmount(amount + everyMillisecondAmount);
        }, 100);
        // clear interval when component unmounts
        return () => clearInterval(interval);
    }, [amount, everyMillisecondAmount]);

    const earnedThisSessionText = Number(ethers.utils.formatEther((amount * multiplier).toFixed(0))).toFixed(18);
    const leadingNumber = earnedThisSessionText.split(".")[0];
    const firstFourDigits = earnedThisSessionText.split(".")[1].substring(0, 4);
    const secondFourDigits = earnedThisSessionText.split(".")[1].substring(4, 8);
    const thirdFourDigits = earnedThisSessionText.split(".")[1].substring(8, 12);
    const finalSixDigits = earnedThisSessionText.split(".")[1].substring(12, 18);
    const earnedThisSessionDisplay = `${leadingNumber}.${firstFourDigits} ${secondFourDigits} ${thirdFourDigits} ${finalSixDigits}`;

    return (
        <p style={{ width: 370, overflow: "hidden", textAlign: "center" }}>
            Earned this session
            <br />
            <b style={{ fontFamily: "monospace", fontSize: "18px" }}>
                {earnedThisSessionDisplay || "Error..."}
            </b>
        </p>
    );
}
