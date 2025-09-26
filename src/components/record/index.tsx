import { cn, getTimezone } from "~/lib/utils";
import { useEffect, useRef, useState } from "react";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Day } from "~/lib/types/day";
import Foods from "./foods";
import Success from "./success";
import Symptoms from "./symptoms";
import { setToday } from "~/lib/actions";

const pages = [
	"date",
	"symptoms",
	"foods",
	"success"
] as const;

export type Page = typeof pages[number];

const Record = ({ showPopup, setShowPopup }: {
	showPopup: boolean;
	setShowPopup: (show: boolean) => void;
}) => {
	const [ page, setPage ] = useState<Page>(pages[0]);
	const [ options, setOptions ] = useState<Day>({
		date: undefined,
		symptoms: undefined,
		severity: undefined,
		foods: []
	});

	const foodCategories = useRef<{
		type: "Dairy" | "Wheat" | "Soy" | "Egg" | "Nuts" | "Fish/Shellfish" | "Corn" | "Meat" | "Other";
		percent: number;
	}[]>([]);

	const changeOption = <T extends keyof Day>(key: T, value: Day[T]) =>
		setOptions(prev => ({
			...prev,
			[ key ]: value
		}));

	const getPage = () => pages.indexOf(page);

	useEffect(() => {
		changeOption("date", new Date());
	}, []);

	return <div className={ cn("bg-white z-20 w-screen absolute shadow-lg h-screen transition-[translate] duration-500 ease-in-out", !showPopup && "translate-x-full") }>
		<div className="absolute w-[max(50%,60rem)] flex flex-col max-w-11/12 h-5/6 top-1/2 left-1/2 p-10 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl">
			<h1 className="uppercase font-montserrat w-72 text-4xl font-extrabold text-zinc-600">{
				page == "date" ? "What date would you like to record?" :
				page == "symptoms" ? "What symptoms did you experience?" :
				page == "foods" ? "What foods did you eat on the date selected?" :
				"Success!"
			}</h1>
			{
				page == "date" ?
					<Calendar required mode="single" selected={ options.date } onSelect={ date => changeOption("date", date) } className="font-mona flex items-center flex-1 self-center text-sm font-semibold text-slate-700" /> :
				page == "symptoms" ?
					<Symptoms options={ options } changeOption={ changeOption } /> :
				page == "foods" ?
					<Foods options={ options } changeOption={ changeOption } /> :
				<Success categories={ foodCategories } />
			}
			<div className="w-full flex justify-between mt-auto">
				<Button onClick={ () =>
					getPage() == 0 || getPage() + 1 == pages.length ?
						setShowPopup(false) :
						setPage(pages[getPage() - 1])
				} className="bg-zinc-600 cursor-pointer text-white font-mona">
					{
						getPage() == 0 || getPage() + 1 == pages.length ?
							"Exit" :
							"Go Back"
					}
				</Button>
				<Button disabled={ page == "foods" && options.foods.length == 0 || page == "symptoms" && options.severity == undefined } onClick={ () =>
					getPage() + 2 < pages.length ?
						setPage(pages[getPage() + 1]) :
						getPage() == pages.length -1 ?
							[
								setOptions({
									date: undefined,
									symptoms: undefined,
									severity: undefined,
									foods: []
								}),
								setPage(pages[0])
							] :
							(async () => {
								const { successful, result } = await setToday(options, getTimezone());

								if (successful) {
									setPage(pages.at(-1)!);

									foodCategories.current = result;
								};
							})()
				} className="bg-zinc-600 cursor-pointer text-white font-mona">
					{ getPage() + 2 < pages.length ?
						"Next" :
						getPage() == pages.length -1 ?
							"Add Another" :
							"Submit"
					}
				</Button>
			</div>
		</div>
	</div>;
};

export default Record;