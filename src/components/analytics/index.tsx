import { Button } from "../ui/button";
import Graphs from "./graphs";

const Analytics = ({ showPopup, setShowPopup }: {
	showPopup: boolean;
	setShowPopup: (show: boolean) => void;
}) => {
	return <div className="flex flex-col h-full overflow-y-scroll">
		<div className="flex items-row items-center backdrop-blur-sm z-10 p-5 sticky top-0 justify-between">
			<h1 className="font-montserrat text-zinc-600 font-black text-2xl sm:text-4xl">Analytics</h1>
			<Button className="bg-zinc-600 shadow-lg cursor-pointer text-white font-mona" onClick={ () =>
				setShowPopup(true)
			}>Record Symptoms</Button>
		</div>
		<Graphs showPopup={ showPopup } />
	</div>;
};

export default Analytics;