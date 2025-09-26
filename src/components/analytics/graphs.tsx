import { useEffect, useMemo, useState } from "react";

import Chart from "./chart";
import Suggestions from "./suggestions";
import { getAll } from "~/lib/actions";

const Graphs = ({ showPopup }: {
	showPopup: boolean;
}) => {
	const [ data, setData ] = useState<{
		symptoms: number;
		triggers: Record<string, number>;
		date: number;
	}[]>([]);
	const [ triggers, setTriggers ] = useState<Array<{
		type: "Dairy" | "Wheat" | "Soy" | "Egg" | "Nuts" | "Fish/Shellfish" | "Corn" | "Meat" | "Other";
		percent: number;
	}>>([]);

	const { dairy, wheat, soy, egg, nuts, "fish/shellfish": fishShellfish, corn, meat, other } = useMemo(() => Object.fromEntries(([
		"Dairy",
		"Wheat",
		"Soy",
		"Egg",
		"Nuts",
		"Fish/Shellfish",
		"Corn",
		"Meat",
		"Other"
	] as const).map(trigger => [ trigger.toLowerCase(), data.map(({ date, symptoms, triggers }) => ({
		date,
		symptoms,
		trigger: (triggers[trigger] ?? 0)
	})) ])), [ data ]) as any as Record<"dairy" | "wheat" | "soy" | "egg" | "nuts" | "fish/shellfish" | "corn" | "meat" | "other", {
		date: number;
		symptoms: number;
		trigger: number;
	}[]>;

	useEffect(() => {
		if (showPopup || window == undefined) return;

		(async () => {
			const res = await getAll();
			if (res.successful) {
				setData(res.result.data);
				setTriggers(res.result.triggers);
			}
		})();
	}, [ showPopup ]);

	return <div className="flex flex-col gap-5 px-5 pb-5">
		{ triggers.length > 0 &&
			<Suggestions triggers={ triggers } />
		}
		{ data.length > 0 ? <>
			<Chart data={ dairy } trigger="Dairy" />
			<Chart data={ wheat } trigger="Wheat" />
			<Chart data={ soy } trigger="Soy" />
			<Chart data={ egg } trigger="Egg" />
			<Chart data={ nuts } trigger="Nuts" />
			<Chart data={ fishShellfish } trigger="Fish/Shellfish" />
			<Chart data={ corn } trigger="Corn" />
			<Chart data={ meat } trigger="Meat" />
			<Chart data={ other } trigger="Other" />
		</> : <h1 className="font-mona text-xl text-zinc-600 font-bold">Not enough data to generate graphs. Try recording more</h1> }
	</div>;
};

export default Graphs;