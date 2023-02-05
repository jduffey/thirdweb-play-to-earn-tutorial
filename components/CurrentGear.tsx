import Image from "next/image";
import { ThirdwebNftMedia, useAddress, useNFT } from "@thirdweb-dev/react";
import { EditionDrop, NFT, SmartContract } from "@thirdweb-dev/sdk";
import React, { useEffect, useState } from "react";
import ContractMappingResponse from "../types/ContractMappingResponse";
import GameplayAnimation from "./GameplayAnimation";
import styles from "../styles/Home.module.css";

type Props = {
    miningContract: SmartContract<any>;
    characterContract: EditionDrop;
    toolsContract: EditionDrop;
};

/**
 * This component shows the:
 * - Currently equipped miner character (right now there is just one (token ID 0))
 * - Currently equipped character's tool
 */
export default function CurrentGear({
    miningContract,
    characterContract,
    toolsContract: toolsContract,
}: Props) {
    const address = useAddress();

    const { data: playerNft } = useNFT(characterContract, 0);
    const [tool, setTool] = useState<NFT>();

    useEffect(() => {
        (async () => {
            if (!address) return;

            const p = (await miningContract.call(
                "playerTool",
                address
            )) as ContractMappingResponse;

            // Now we have the tokenId of the equipped tool, if there is one, fetch the metadata for it
            if (p.isData) {
                const toolMetadata = await toolsContract.get(p.value);
                setTool(toolMetadata);
            }
        })();
    }, [address, miningContract, toolsContract]);

    return (
        <div style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
            <h2 style={{ color: "yellow" }}>{address}</h2>
            <h2 className={`${styles.noGapTop} `}>You and Your Tools</h2>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                }}
            >
                {/* Currently equipped player */}
                <div style={{ outline: "1px solid grey", borderRadius: 16 }}>
                    {playerNft && (
                        <ThirdwebNftMedia metadata={playerNft?.metadata} height={"150px"} width={"150px"} />
                    )}
                </div>
                {/* Currently equipped tool */}
                <div
                    style={{ outline: "1px solid grey", borderRadius: 16, marginLeft: 8 }}
                >
                    {tool && (
                        // @ts-ignore
                        <ThirdwebNftMedia metadata={tool.metadata} height={"150px"} width={"150px"} />
                    )}
                </div>
            </div>

            {/* Gameplay Animation */}

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 24,
                }}
            >
                <Image src="/octopus.png" height={64} width={64} alt="character-mining" />
                <GameplayAnimation tool={tool} />
            </div>
        </div>
    );
}
