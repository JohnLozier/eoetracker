import { IconBurger, IconCoffee, IconCookie, IconToolsKitchen2, IconX } from "@tabler/icons-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useRef, useState } from "react";

import { Button } from "../ui/button";
import { Day } from "~/lib/types/day";
import { Input } from "../ui/input";

const Foods = ({ options, changeOption }: {
	options: Day;
	changeOption: <T extends keyof Day>(key: T, value: Day[T]) => void;
}) => {
	const [ description, setDescription ] = useState<string>("");

	const time = useRef<string | undefined>(undefined);

	const addFood = ()  => {
		changeOption("foods", [
			...options.foods,
			{
				time: time.current as "breakfast" | "lunch" | "dinner" | "snack",
				description: description!
			}
		]);
		setDescription("");
	};

	return <div className="flex flex-1 sm:px-[20%] flex-col items-center justify-center gap-y-5">
		<div className="flex flex-row items-center w-full gap-x-2">
			<Select onValueChange={ value => time.current = value }>
				<SelectTrigger className="border-none cursor-pointer shadow-lg font-mona font-medium text-slate-600">
					<SelectValue placeholder="Meal" />
				</SelectTrigger>
				<SelectContent className="border-none bg-white text-slate-500 font-mona shadow-lg text-xs font-medium">
					<SelectItem className="hover:bg-red-300 hover:text-white cursor-pointer text-xs" value="dinner">Dinner</SelectItem>
					<SelectItem className="hover:bg-red-300 hover:text-white cursor-pointer text-xs" value="breakfast">Breakfast</SelectItem>
					<SelectItem className="hover:bg-red-300 hover:text-white cursor-pointer text-xs" value="lunch">Lunch</SelectItem>
					<SelectItem className="hover:bg-red-300 hover:text-white cursor-pointer text-xs" value="snack">Snack</SelectItem>
				</SelectContent>
			</Select>
			<Input onKeyDown={ event => event.key == "Enter" && [
				event.preventDefault(),
				addFood()
			] } value={ description } onChange={ ({ currentTarget }) =>
				setDescription(currentTarget.value)
			} placeholder="Describe the meal you ate" className="border-none shadow-lg placeholder:text-xs placeholder:text-slate-600/80 focus-visible:ring-0 text-slate-600 font-medium font-mona" />
			<Button onClick={ addFood } className="bg-zinc-600 shadow-lg cursor-pointer text-white font-mona" disabled={ !description }>Add{ options.foods.length > 0 ? " another" : "" }</Button>
		</div>
		<div className="flex flex-row flex-wrap gap-2">
			{
				options.foods.map(({ time, description }, index) =>
					<span className="font-mona rounded-sm shadow-md font-semibold text-sm flex items-center gap-x-1 bg-red-300 text-white px-2 py-1" key={ description }>
						{
							(() => {
								switch (time) {
									case "breakfast":
										return <IconCoffee className="size-4" />;
									case "lunch":
										return <IconBurger className="size-4" />;
									case "dinner":
										return <IconToolsKitchen2 className="size-4" />;
									case "snack":
										return <IconCookie className="size-4" />;
								}
							})()
						}
						{ description }
						<IconX onClick={ () => changeOption("foods", options.foods.filter((_, i) => i != index)) } strokeWidth={ 3 } className="size-4 hover:scale-115 cursor-pointer transition-[scale]" />
					</span>
				)
			}
		</div>
	</div>;
};

export default Foods;