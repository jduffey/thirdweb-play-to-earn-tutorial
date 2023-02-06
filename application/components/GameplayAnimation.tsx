import Image from "next/image";
import { NFT } from "@thirdweb-dev/sdk";
import React from "react";
import styles from "../styles/Gameplay.module.css";

const SeaShell = (
    <div className={styles.slide}>
    <Image src="/seashell.png" height="48" width="48" alt="seashell" />
    </div>
);

type Props = {
    tool: NFT | undefined;
};

export default function GameplayAnimation({ tool: tool }: Props) {
    if (!tool) {
        return <div style={{ marginLeft: 8 }}>I need a tool!</div>;
    }

    return (
        <div className={styles.slider}>
            <div className={styles.slideTrack}>
                {SeaShell}
                {SeaShell}
                {SeaShell}
                {SeaShell}
                {SeaShell}
                {SeaShell}
                {SeaShell}
                {SeaShell}
                {SeaShell}
                {SeaShell}
                {SeaShell}
                {SeaShell}
                {SeaShell}
            </div>
        </div>
    );
}
