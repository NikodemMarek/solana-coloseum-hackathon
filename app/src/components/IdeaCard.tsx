import { Box, Button, Card, CardContent, Dialog, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Idea } from "../data/data.ts";
import { buyIdea } from "../data/api.ts";
import { useEffect, useState } from "react";
import { Description, PriceCheck, Title, VerifiedUser } from "@mui/icons-material";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

function IdeaCard({ idea, forSale }: { idea: Idea, forSale: boolean}) {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [showDescription, setShowDescription] = useState(false)
    const [shortDescription, setShortDescription] = useState("")

    useEffect(() => {
        const desc = idea.content.description.split(" ") || []
        if (desc.length >= 50) {
            setShortDescription(desc.splice(50).join(" ") + "...")
        } else {
            setShortDescription(idea.content.description || "")
        }
    }, [idea.content.description])

    return (
        <Card sx={{
            width: window.innerWidth < 640 ? "100%" : "16rem",
            maxWidth: "20rem"
        }}
        >
            <CardContent>
                <Typography gutterBottom variant="h5">
                    {idea.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{
                    marginBottom: "1rem"
                }}>
                    {shortDescription}
                </Typography>

                {forSale ? (
                <Box
                    className={"flex w-full justify-between"}
                >
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setShowDescription(true)
                        }}
                    >More&nbsp;Info</Button>
                    {idea.isForSale && !wallet.publicKey?.equals(idea.owner) ? (
                        <Button
                            variant="outlined"
                            disabled={wallet.publicKey == null}
                            onClick={async () => {
                                try {
                                    await buyIdea(connection, wallet, idea, wallet.publicKey);
                                } catch (error) {
                                    console.error("Error creating idea", error);
                                }
                            }}
                        >
                            Buy&nbsp;Idea
                        </Button>
                    ) : (
                        <Button
                            variant="outlined"
                            disabled={true}
                        >
                            Your&nbsp;idea
                        </Button>
                    )}
                </Box>
                ) : (
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setShowDescription(true)
                        }}
                    >More&nbsp;Info</Button>
                )}
            </CardContent>
            <Dialog
                open={showDescription}
                onClose={() => setShowDescription(false)}
            >
                <Box className="w-[20rem] sm:w-[36rem] p-5 h-screen bg-white">
                    <button type="button" className="bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => {
                        setShowDescription(false)
                    }}>
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        <span className="sr-only">Close menu</span>
                    </button>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <Title />
                            </ListItemIcon>
                            <ListItemText>
                                <Typography variant="h2">{idea.title}</Typography>
                            </ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <VerifiedUser />
                            </ListItemIcon>
                            <ListItemText sx={{ overflowX: 'scroll' }}>
                                <Typography>
                                    {wallet.publicKey && idea.owner.equals(wallet.publicKey) ? "you" : idea.owner.toString()}
                                </Typography>
                            </ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <PriceCheck />
                            </ListItemIcon>
                            <ListItemText>
                                <Typography>
                                    {
                                        (idea.price / LAMPORTS_PER_SOL).toString() + " SOL" + (idea.isForSale ? " (for sale)" : " (not for sale)")
                                    }
                                </Typography>
                            </ListItemText>
                        </ListItem>
                        <ListItem>
                            {window.innerWidth >= 640 && (
                                <ListItemIcon>
                                    <Description />
                                </ListItemIcon>
                            )}
                            <ListItemText>
                                <Typography>
                                    {window.innerWidth < 640 && (
                                        <Description sx={{
                                            marginRight: "32px",
                                            color: "rgba(0,0,0,0.54)",
                                        }} />
                                    )}
                                    {idea.content.description}
                                </Typography>
                            </ListItemText>
                        </ListItem>
                    </List>
                </Box>
            </Dialog>
        </Card>
    );
}

export default IdeaCard;
