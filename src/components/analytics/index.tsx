import { Button } from "../ui/button";
import Graphs from "./graphs";
import { useRef, useState } from "react";

const Analytics = ({ showPopup, setShowPopup }: {
	showPopup: boolean;
	setShowPopup: (show: boolean) => void;
}) => {
	const analyticsAnchorRef = useRef<HTMLDivElement | null>(null);
	const [hasGraphs, setHasGraphs] = useState(false);

	return <div className="flex flex-col h-full overflow-y-scroll">
		<div className="flex items-row items-center backdrop-blur-sm z-10 p-5 sticky top-0 justify-between">
			<h1 className="font-montserrat text-zinc-600 font-black text-2xl sm:text-4xl">Analytics</h1>
			<div className="flex items-center gap-3">
				{hasGraphs && (
					<Button className="bg-zinc-600 shadow-lg cursor-pointer text-white font-mona" onClick={() =>
						analyticsAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
					}>View AI Analytics</Button>
				)}
				<Button className="bg-zinc-600 shadow-lg cursor-pointer text-white font-mona" onClick={() =>
					setShowPopup(true)
				}>Record Symptoms</Button>
			</div>
		</div>
		<Graphs showPopup={showPopup} analyticsAnchorRef={analyticsAnchorRef} setHasGraphs={setHasGraphs} />
	</div>;
};

export default Analytics;
