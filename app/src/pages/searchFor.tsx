import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import IdeasGrid from "../components/IdeasGrid";
import { ChangeEventHandler, useEffect, useState } from "react";
import { getIdeasForSale } from "../data/api";
import { Idea } from "../data/data";
import { CircularProgress, FormControlLabel, InputAdornment, Switch, TextField, Typography } from "@mui/material";
import { Search } from "@mui/icons-material";

export default function SearchForPage() {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [ideas, setIdeas] = useState([] as Idea[]);
    const [filteredIdeas, setFilteredIdeas] = useState([] as Idea[])
    const [search, setSearch] = useState("")
    const [error, setError] = useState(false)
    const [showUserIdeas, setShowUserIdeas] = useState(true)
    const [spinner, setSpinner] = useState(true)

    const handleSearch: ChangeEventHandler = (e) => {
        const input = (e.target as HTMLInputElement).value;
        setSearch(input)
    }

    useEffect(() => {
        (async () => {
            setSpinner(true)
            setError(false)
            const ideas = await getIdeasForSale(connection, wallet);
            setIdeas(ideas);
            setFilteredIdeas(ideas);
        })()
        .catch(e => {
            console.error(e)
            setError(true)
        })
        .finally(() => {
            setSpinner(false)
        });
    }, [connection, wallet]);

    useEffect(() => {
        let filteredIdeas1 = ideas.filter(idea =>
            idea.title.includes(search) || idea.content.description.includes(search) || idea.owner.toString().includes(search)
        )

        if (!showUserIdeas) {
            filteredIdeas1 = filteredIdeas1.filter(idea =>
                !idea.owner.equals(wallet.publicKey!)
            )
        }

        setFilteredIdeas(filteredIdeas1)
    }, [search, ideas, showUserIdeas, wallet])

    return (
        <div className="p-5 flex flex-col grow h-full">
            <div className="pt-1 mb-3 w-full flex flex-col justify-center sticky top-0 bg-white/90">
                <TextField
                    onChange={handleSearch}
                    label="Search for an idea"
                    sx={{
                        marginX: 'auto',
                        width: '20rem',
                        marginBottom: '0.5rem'
                    }}
                    InputProps={{
                        endAdornment: <InputAdornment position="end"><Search /></InputAdornment>,
                    }}
                />
                {wallet.publicKey == null ? (
                    <Typography color={"red"} textAlign={"center"}>You need to connect your wallet to buy ideas</Typography>
                ) : (
                    <FormControlLabel
                        sx={{
                            marginX: 'auto',
                            width: '20rem',
                            justifyContent: 'space-between'
                        }}
                        control={<Switch
                            checked={showUserIdeas}
                            onChange={(_, checked) => {
                                console.log(checked)
                                setShowUserIdeas(checked)
                            }}
                        />}
                        labelPlacement="start"
                        label={"Show your ideas?"}
                    />
                )}
                {error &&
                    <Typography color={"red"} textAlign={"center"}>There was an error during idea fetching. Try again in a moment.</Typography>
                }
            </div>
            {spinner ? (
                <div className="grow flex items-center justify-center">
                    <CircularProgress size={"3rem"} sx={{marginTop: "-6rem"}} />
                </div>
            ) : (
                <IdeasGrid ideas={filteredIdeas} forSale={true} />
            )}
        </div>
    )
}
