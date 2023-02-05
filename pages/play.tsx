import {
    ConnectWallet,
    useAddress,
    useContract,
    useEditionDrop,
    useToken,
    // useMetamask,
} from "@thirdweb-dev/react";
import React from "react";
import CurrentGear from "../components/CurrentGear";
import LoadingSection from "../components/LoadingSection";
import OwnedGear from "../components/OwnedGear";
import Rewards from "../components/Rewards";
import Shop from "../components/Shop";
import {
    CHARACTERS_ADDRESS,
    TOOLS_ADDRESS,
    SEA_SHELLS_ADDRESS,
    MINING_ADDRESS,
} from "../const/contractAddresses";
import styles from "../styles/Home.module.css";

export default function Play() {
    const address = useAddress();

    const { contract: miningContract } = useContract(MINING_ADDRESS, "mining");
    const { contract: characterContract } = useContract(
        CHARACTERS_ADDRESS,
        "edition-drop"
    );
    const { contract: toolsContract } = useContract(
        TOOLS_ADDRESS,
        "edition-drop"
    );
    const { contract: tokenContract } = useContract(SEA_SHELLS_ADDRESS, "token");

    if (!address) {
        return (
            <div className={styles.container}>
                <ConnectWallet colorMode="dark" />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {miningContract &&
                characterContract &&
                tokenContract &&
                toolsContract ? (
                <div className={styles.mainSection}>
                    <CurrentGear
                        miningContract={miningContract}
                        characterContract={characterContract}
                        pickaxeContract={toolsContract}
                    />
                    <Rewards
                        miningContract={miningContract}
                        tokenContract={tokenContract}
                    />
                </div>
            ) : (
                <LoadingSection />
            )}

            <hr className={`${styles.divider} ${styles.bigSpacerTop}`} />

            {toolsContract && miningContract ? (
                <>
                    <h2 className={`${styles.noGapTop} ${styles.noGapBottom}`}>
                        Your Owned Tools
                    </h2>
                    <div
                        style={{
                            width: "100%",
                            minHeight: "10rem",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 8,
                        }}
                    >
                        <OwnedGear
                            pickaxeContract={toolsContract}
                            miningContract={miningContract}
                        />
                    </div>
                </>
            ) : (
                <LoadingSection />
            )}

            <hr className={`${styles.divider} ${styles.bigSpacerTop}`} />

            {toolsContract && tokenContract ? (
                <>
                    <h2 className={`${styles.noGapTop} ${styles.noGapBottom}`}>Shop</h2>
                    <div
                        style={{
                            width: "100%",
                            minHeight: "10rem",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 8,
                        }}
                    >
                        <Shop pickaxeContract={toolsContract} />
                    </div>
                </>
            ) : (
                <LoadingSection />
            )}
        </div>
    );
}
