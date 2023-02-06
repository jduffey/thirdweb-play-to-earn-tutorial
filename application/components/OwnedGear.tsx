import {
    ThirdwebNftMedia,
    useAddress,
    useOwnedNFTs,
    Web3Button,
} from "@thirdweb-dev/react";
import { EditionDrop, SmartContract } from "@thirdweb-dev/sdk";
import React from "react";
import LoadingSection from "./LoadingSection";
import styles from "../styles/Home.module.css";
import { MINING_ADDRESS } from "../const/contractAddresses";

type Props = {
    toolsContract: EditionDrop;
    miningContract: SmartContract<any>;
};

/**
 * This component shows the:
 * - Tools the connected wallet has
 * - A stake button underneath each of them to equip it
 */
export default function OwnedGear({ toolsContract: toolsContract, miningContract }: Props) {
    const address = useAddress();
    const { data: ownedTools, isLoading } = useOwnedNFTs(
        toolsContract,
        address
    );

    if (isLoading) {
        return <LoadingSection />;
    }

    async function equip(id: string) {
        if (!address) return;

        // The contract requires approval to be able to transfer the tool
        const hasApproval = await toolsContract.isApproved(
            address,
            MINING_ADDRESS
        );

        if (!hasApproval) {
            await toolsContract.setApprovalForAll(MINING_ADDRESS, true);
        }

        await miningContract.call("stake", id);

        // Refresh the page
        window.location.reload();
    }

    return (
        <>
            <div
                className={styles.nftBoxGrid}
                style={{ display: "flex", flexDirection: "column", textAlign: "center" }}
            >
                {ownedTools?.map((p) => (
                    <div className={styles.nftBox} key={p.metadata.id.toString()} >
                        <ThirdwebNftMedia
                            metadata={p.metadata}
                            className={`${styles.nftMedia} ${styles.spacerTop}`}
                            width="150px"
                            height="150px"
                        />
                        <h3>{p.metadata.name}</h3>

                        <div className={styles.smallMargin}>
                            <Web3Button
                                colorMode="dark"
                                contractAddress={MINING_ADDRESS}
                                action={() => equip(p.metadata.id)}
                            >
                                Equip
                            </Web3Button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
