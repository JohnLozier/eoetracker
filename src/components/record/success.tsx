import { IconBread, IconEgg, IconFish, IconGrowth, IconMeat, IconMilk, IconNut, IconSeeding, IconSparkles } from "@tabler/icons-react";

import { RefObject } from "react";

const Success = ({ categories }: {
	categories: RefObject<{
		type: "Dairy" | "Wheat" | "Soy" | "Egg" | "Nuts" | "Fish/Shellfish" | "Corn" | "Meat" | "Other";
		percent: number;
	}[]>
}) => {
	return <div className="flex flex-1 items-center flex-col justify-center gap-y-15 sm:p-6">
		<h2 className="max-w-md text-slate-700 font-montserrat font-bold text-center text-2xl leading-tight">Here's a breakdown of what your diet was composed of</h2>
		<div className="bg-green-100 text-green-800 w-96 max-w-full font-mona p-4 font-semibold flex flex-col gap-y-3 rounded-xl">
			{ categories.current.map(food => (
				<div key={ food.type } className="w-full gap-x-3 text-green-800 items-center flex flex-row">
					{
						(() => {
							switch (food.type) {
								case "Dairy":
									return <IconMilk className="text-green-600" />
								case "Wheat":
									return <IconBread className="text-green-600" />
								case "Soy":
									return <IconSeeding className="text-green-600" />
								case "Egg":
									return <IconEgg className="text-green-600" />
								case "Nuts":
									return <IconNut className="text-green-600" />
								case "Fish/Shellfish":
									return <IconFish className="text-green-600" />
								case "Corn":
									return <IconGrowth className="text-green-600" />
								case "Meat":
									return <IconMeat className="text-green-600" />
								case "Other":
									return;
							}
						})()
					}
					{ food.type }
					<span className="ml-auto font-bold px-3 py-1.5 bg-green-600/50 text-white rounded-full text-sm">{ food.percent }%</span>
				</div>
			)) }
		</div>
	</div>;
};

export default Success;