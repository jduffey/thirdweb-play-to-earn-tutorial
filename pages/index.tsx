import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import {
    ConnectWallet,
    useAddress,
    useEditionDrop,
    useOwnedNFTs,
} from "@thirdweb-dev/react";
import { CHARACTERS_ADDRESS } from "../const/contractAddresses";
import { useRouter } from "next/router";

const Home: NextPage = () => {
    const editionDrop = useEditionDrop(CHARACTERS_ADDRESS);

    const address = useAddress();

    const router = useRouter();

    const {
        data: ownedNFTs,
        isLoading,
        isError,
    } = useOwnedNFTs(editionDrop, address);

    // 0. Wallet Connect - required to check if they own an NFT
    if (!address) {
        return (
            <div className={styles.container}>
                <ConnectWallet />
            </div>
        );
    }

    // 1. Loading
    if (isLoading) {
        return (
            <div>
                Loading...
            </div>
        );
    }

    // If something went wrong..
    if (!ownedNFTs || isError) {
        return (
            <div>
                Error
            </div>
        );
    }

    // 2. If they don't own an NFT, show them the mint page
    if (ownedNFTs.length === 0) {
        return (
            <div className={styles.container}>
                <MintContainer />
            </div>
        );
    }

    // 3. If they own an NFT, show them the NFT page
    return (
        <div className={styles.container}>
            <button
                className={`${styles.mainButton} ${styles.spacerBottom}`}
                onClick={() => router.push('/play')}
            >
                Play Game
            </button>
        </div>
    );


}

export default Home;