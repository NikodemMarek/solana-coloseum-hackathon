import { Box, TextField } from "@mui/material";
import { Idea } from "../data/data.ts";
import { ChangeEventHandler } from "react";

function IdeaEditor({ idea, onChange }: { idea: Idea; onChange: (idea: Idea) => void }) {
    const handleTitleChange: ChangeEventHandler = (e) => {
        const input = (e.target as HTMLInputElement).value;
        onChange({ ...idea, title: input });
    };

    const handleDescriptionChange: ChangeEventHandler = (e) => {
        const input = (e.target as HTMLInputElement).value;
        onChange({ ...idea, description: input });
    };

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <TextField
                id="outlined-basic"
                label="Name your idea"
                variant="outlined"
                onChange={handleTitleChange}
                value={idea.title}
            />
            <TextField
                id="outlined-textarea"
                label="Describe your idea"
                variant="outlined"
                onChange={handleDescriptionChange}
                value={idea.description}
                minRows={3}
                multiline
            />
        </Box>
    );
}

export default IdeaEditor;
