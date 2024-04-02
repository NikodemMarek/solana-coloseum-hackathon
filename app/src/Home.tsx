import { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Box, Button } from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { Idea } from "./data/data.ts";
import IdeaEditor from "./components/IdeaEditor.tsx";
import IdeasGrid from "./components/IdeasGrid.tsx";

import { createIdea, getIdeas } from "./data/api.ts";

const Home = () => {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [ideas, setIdeas] = useState([] as Idea[]);

    const emptyIdea = () => {
        return {
            title: "",
            description: "",
            price: 1 * LAMPORTS_PER_SOL,
            isForSale: true,
            owner: wallet.publicKey?.toString(),
        } as Idea
    }

    const [idea, setIdea] = useState(emptyIdea());

    useEffect(() => {
        (async () => {
            const ideas = await getIdeas(connection, wallet);
            setIdeas(ideas);
        })().catch(err => console.error(err));
    }, [connection, wallet]);

    return (
        <Box display="flex" flexDirection="row" margin={2} gap={2}>
            <Box minWidth="25%" display="flex" flexDirection="column" gap={2}>
                <IdeaEditor idea={idea} onChange={setIdea} />
                <Button
                    variant="outlined"
                    onClick={() => {
                        if (wallet.publicKey == null) {
                            return
                        }

                        createIdea(
                            connection,
                            wallet,
                            idea.title,
                            idea.description,
                            idea.price,
                            idea.isForSale,
                            wallet.publicKey,
                        ).then(() => {
                            setIdeas([...ideas, idea]);
                            setIdea(emptyIdea());
                        }).catch(error => {
                            console.error("Error creating idea", error);
                        })
                    }}
                >
                    Add Idea
                </Button>
            </Box>

            <Box flex={1}>
                <IdeasGrid ideas={ideas} />
            </Box>
        </Box>
    );
};

export default Home;

