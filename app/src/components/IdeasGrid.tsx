import Masonry from "@mui/lab/Masonry";
import { Idea } from "../data/data.ts";
import IdeaCard from "./IdeaCard";

const IdeasGrid = ({ ideas, forSale }: { ideas: Idea[], forSale: boolean }) => {
    return window.innerWidth >= 640 ? (
        <Masonry columns={4} spacing={2}>
            {ideas.map((idea, key) => (
                <IdeaCard key={key} idea={idea} forSale={forSale} />
            ))}
        </Masonry>
    ) : (
        <div className="w-full flex flex-col items-center space-y-4">
            {ideas.map((idea, key) => (
                <IdeaCard key={key} idea={idea} forSale={forSale} />
            ))}
        </div>
    )
};

export default IdeasGrid;
