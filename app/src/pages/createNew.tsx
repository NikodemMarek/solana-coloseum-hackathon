import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ChangeEventHandler, useEffect, useState } from "react";
import { Idea } from "../data/data";
import { createIdea } from "../data/api.ts";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useNavigate } from "react-router";
import { LoadingButton } from "@mui/lab";

export default function NewIdeaPage() {
    const { connection } = useConnection();
    const wallet = useWallet();
    const navigate = useNavigate();

    const [message, setMessage] = useState({ type: "none", msg: "" })
    const [price, setPrice] = useState(1)
    const [loading, setLoading] = useState(false)

    const [idea, setIdea] = useState({
        title: "",
        description: "",
        price: price * LAMPORTS_PER_SOL,
        isForSale: true,
        owner: wallet.publicKey?.toString(),
    } as Idea);

    const handleTitleChange: ChangeEventHandler = e => {
        const input = (e.target as HTMLInputElement).value;
        setIdea({ ...idea, title: input });
    };

    const handleDescriptionChange: ChangeEventHandler = e => {
        const input = (e.target as HTMLInputElement).value;
        setIdea({ ...idea, description: input });
    };

    const handlePriceChange: ChangeEventHandler = e => {
        const el = e.target as HTMLInputElement
        if (el.value != "" && !/^[0-9]+(?:\.[0-9]*){0,1}$/.test(el.value)) {
            setPrice(-1)
            return
        }

        const input = parseFloat(el.value);
        setPrice(input)
        setIdea({ ...idea, price: Math.round(input * LAMPORTS_PER_SOL) });
    };

    const create = () => {
        if (wallet.publicKey == null) {
            return
        }

        setLoading(true)

        createIdea(
            connection,
            wallet,
            idea.title,
            idea.description,
            idea.price,
            idea.isForSale,
            wallet.publicKey,
        )
            .then(() => {
                setMessage({ type: "ok", msg: "Idea added sucessfully" })
            })
            .catch(err => {
                console.error(err)
                setMessage({ type: "error", msg: "There was an error during idea creation. Try again in a moment" })
            })
            .finally(() => {
                setLoading(false)
            })

        return
    }

    useEffect(() => {
        if (wallet.publicKey == null || !wallet.connected) {
            navigate("/")
        }
    }, [wallet, navigate])

    return (
        <div
            className="flex w-full h-full justify-center items-center"
        >
            <div
                className='flex flex-col gap-2 p-8 border border-black rounded w-96'
            >
                <Typography variant="h3" textAlign={'center'} marginY={1}>Idea creator</Typography>
                <TextField
                    label="Your ideas name"
                    variant="outlined"
                    onChange={handleTitleChange}
                    value={idea.title}
                />
                <TextField
                    label="Description of the idea"
                    variant="outlined"
                    onChange={handleDescriptionChange}
                    value={idea.description}
                    minRows={3}
                    multiline
                />
                <TextField
                    label="Price"
                    variant="outlined"
                    inputMode="numeric"
                    onChange={handlePriceChange}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">SOL</InputAdornment>,
                    }}
                    error={price < 0}
                />
                <LoadingButton
                    loading={loading}
                    variant="outlined"
                    onClick={create}
                    onChange={handleDescriptionChange}
                    value={idea.description}
                >
                    Add idea
                </LoadingButton>
                {message.type != "none" && <Box>
                    {message.msg}
                </Box>}
            </div>
        </div>
    )
}
