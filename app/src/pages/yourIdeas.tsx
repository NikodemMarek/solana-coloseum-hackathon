import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import IdeasGrid from "../components/IdeasGrid";
import { ChangeEventHandler, useEffect, useState } from "react";
import { Idea } from "../data/data";
import { CircularProgress, InputAdornment, TextField, Typography } from "@mui/material";
import { Search } from "@mui/icons-material";
import { getIdeas } from "../data/api";

export default function YourIdeas() {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [ideas, setIdeas] = useState([] as Idea[]);
    const [search, setSearch] = useState("")
    const [error, setError] = useState(false)
    const [spinner, setSpinner] = useState(true)

    const handleSearch: ChangeEventHandler = (e) => {
        const input = (e.target as HTMLInputElement).value;
        setSearch(input)
    }

    useEffect(() => {
        if (wallet.publicKey == null) {
            return
        }

        (async () => {
            setSpinner(true)
            setError(false)
            const ideas = (await getIdeas(connection, wallet))
                .filter(idea => idea.owner.equals(wallet.publicKey!))
            setIdeas(ideas);
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
        setIdeas(ideas.filter(idea =>
            idea.title.includes(search) || idea.description.includes(search)
        ))
    }, [search])

    if (wallet.publicKey == null) {
        return (
            <div className="p-5 flex flex-col grow justify-center items-center">
                <p className="text-[red]">You need to be logged in to check your ideas.</p>
            </div>
        )
    }

    return (
        <div className="p-5 flex flex-col grow h-full">
            <div className="pt-1 mb-3 w-full flex flex-col justify-center sticky top-0 bg-white/90">
                <TextField
                    onChange={handleSearch}
                    label="Search through your ideas"
                    sx={{
                        marginX: 'auto',
                        width: '20rem',
                        marginBottom: '0.5rem'
                    }}
                    InputProps={{
                        endAdornment: <InputAdornment position="end"><Search /></InputAdornment>,
                    }}
                />
                {error &&
                    <Typography color={"red"} textAlign={"center"}>There was an error during idea fetching. Try again in a moment.</Typography>
                }
            </div>
            {spinner ? (
                <div className="grow flex items-center justify-center">
                    <CircularProgress size={"3rem"} sx={{ marginTop: "-6rem" }} />
                </div>
            ) : (
                <IdeasGrid ideas={ideas} forSale={false} />
            )}
        </div>
    )
}
