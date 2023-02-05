import { useNFTs } from "@thirdweb-dev/react";
import { EditionDrop } from "@thirdweb-dev/sdk";
import React from "react";
import styles from "../styles/Home.module.css";
import ShopItem from "./ShopItem";

type Props = {
    toolsContract: EditionDrop;
};

/**
 * This component shows the:
 * - All of the available tools from the edition drop and their price.
 */
export default function Shop({ toolsContract: toolsContract }: Props) {
    const { data: availableTools } = useNFTs(toolsContract);

    return (
        <>
            <div className={styles.nftBoxGrid}>
                {availableTools?.map((p) => (
                    <ShopItem
                        toolsContract={toolsContract}
                        item={p}
                        key={p.metadata.id.toString()}
                    />
                ))}
            </div>
        </>
    );
}
