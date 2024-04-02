import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import IdeasGrid from "../components/IdeasGrid";
import { ChangeEventHandler, useEffect, useState } from "react";
import { getIdeas } from "../data/api";
import { Idea } from "../data/data";
import { InputAdornment, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";

export default function SearchForPage() {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [ideas, setIdeas] = useState([] as Idea[]);
    const [filteredIdeas, setFilteredIdeas] = useState([] as Idea[])
    const [search, setSearch] = useState("")

    const handleSearch: ChangeEventHandler = (e) => {
        const input = (e.target as HTMLInputElement).value;
        setSearch(input)
    }

    useEffect(() => {
        (async () => {
            const ideas = await getIdeas(connection, wallet);
            setIdeas(ideas);
            setFilteredIdeas(ideas);
        })().catch(e => console.error(e));
    }, [connection, wallet]);

    useEffect(() => {
        setFilteredIdeas(ideas.filter(idea =>
            idea.title.includes(search) || idea.description.includes(search)
        ))
    }, [search, ideas])

    return (
        <div className="p-5 flex flex-col justify-center">
            <TextField
                onChange={handleSearch}
                label="Search for idea"
                sx={{
                    marginX: 'auto',
                    marginTop: '1rem',
                    marginBottom: '3rem',
                    width: '20rem',
                }}
                InputProps={{
                    endAdornment: <InputAdornment position="end"><Search/></InputAdornment>,
                }}
            />
            <IdeasGrid ideas={filteredIdeas} />
        </div>
    )
}
