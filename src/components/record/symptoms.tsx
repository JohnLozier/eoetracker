import { Button } from "../ui/button";
import { Day } from "~/lib/types/day";
import DayJS from "dayjs";
import { Slider } from "~/components/ui/slider";
import { Textarea } from "~/components/ui/textarea";
import { estimateSeverity } from "~/lib/actions";

const Symptoms = ({ options, changeOption }: {
	options: Day;
	changeOption: <T extends keyof Day>(key: T, value: Day[T]) => void;
}) => {
	return <div className="flex flex-1 flex-col w-full items-center justify-center gap-y-10">
		<Textarea value={ options.symptoms } onKeyDown={ event => event.key == "Enter" && [
			event.preventDefault(),
			(event.target as HTMLTextAreaElement).blur()
		] } onChange={ ({ currentTarget }) => changeOption("symptoms", currentTarget.value) } className="w-11/12 border-none resize-none h-48 shadow-lg placeholder:text-xs placeholder:text-slate-600/80 focus-visible:ring-0 text-slate-600 font-medium font-mona" placeholder={`Describe your symptoms experienced on ${ DayJS(options.date).format("MMM D") } in detail.`} maxLength={ 255 } onBlur={ async ({ currentTarget }) =>
			options.severity == undefined && changeOption("severity", currentTarget.value ? (await estimateSeverity(currentTarget.value)).result ?? 0 : 0)
		} />
		{ options.severity != undefined ? <>
			<div className="w-11/12 flex flex-row items-center gap-x-5 text-slate-600 text-base font-mona font-semibold">
				0
				<Slider value={ [options.severity] } onValueChange={ value => changeOption("severity", value[0]) } className="flex flex-1" min={ 0 } max={ 10 } />
				10
			</div>
		</> : <Button disabled={ !options.symptoms || options.symptoms.length == 0 } className="bg-zinc-600 shadow-lg cursor-pointer text-white font-mona">Done</Button> }
	</div>;
};

export default Symptoms;