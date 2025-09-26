import { ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart";
import { Line, LineChart, XAxis, YAxis } from "recharts";

import DayJS from "dayjs";

const Chart = ({ data, trigger }: {
	data: {
		date: number;
		trigger: number;
		symptoms: number;
	}[];
	trigger: "Dairy" | "Wheat" | "Soy" | "Egg" | "Nuts" | "Fish/Shellfish" | "Corn" | "Meat" | "Other";
}) => {
	if (!data.some(({ trigger }) => trigger > 0))
		return;

  	return <div className="h-[30rem] relative w-full p-5 rounded-lg shadow-lg">
		<h2 className="absolute text-zinc-600 z-[5] font-black text-lg top-5 right-5">{ trigger }</h2>
		<ChartContainer config={ {
			trigger: {
				label: `${ trigger } Consumed`
			},
			symptoms: {
				label: "Symptom Severity"
			},
			date: {
				label: "Date"
			}
		} } className="size-full">
			<LineChart data={ data } margin={ {
				left: -30
			} }>
				<XAxis padding={ {
					left: 10,
					right: 10
				} } fontFamily="Mona-Sans" fontWeight={ 500 } tickLine={ false } dataKey="date" axisLine={ false } tickFormatter={ value => DayJS(value).format("MMM D, YY") } />
				<YAxis padding={ {
					top: 10
				} } domain={ [ 0, 100 ] } yAxisId="right" hide dataKey="trigger" strokeWidth={ 1.5 } fontFamily="Mona-Sans" fontWeight={ 500 } />
				<YAxis padding={ {
					top: 10
				} } domain={ [ 0, 10 ] } yAxisId="left" dataKey="symptoms" strokeWidth={ 1.5 } fontFamily="Mona-Sans" fontWeight={ 500 } />
				<Line yAxisId="right" connectNulls type="monotone" dataKey="trigger" strokeWidth={ 2 } stroke="#D94040" dot={ false } activeDot={ { r:5 } } />
				<Line yAxisId="left" type="monotone" dataKey="symptoms" strokeWidth={ 2 } stroke="#ffa2a2" dot={ false } activeDot={ { r: 5 } } />
				<ChartTooltip animationDuration={ 100 } content={ <ChartTooltipContent className="backdrop-blur-md font-mona border-none bg-zinc-600/10" hideLabel indicator="line" /> } />
			</LineChart>
		</ChartContainer>
	</div>;
};

export default Chart;