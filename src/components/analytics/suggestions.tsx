const Suggestions = ({ triggers }: {
	triggers: {
		type: "Dairy" | "Wheat" | "Soy" | "Egg" | "Nuts" | "Fish/Shellfish" | "Corn" | "Meat" | "Other";
		percent: number;
	}[];
}) => {
	return <div className="w-full p-5 rounded-lg shadow-lg flex flex-col gap-y-2">
		<h2 className="text-zinc-600 font-bold font-montserrat text-lg">Possible Triggers</h2>
		{
			triggers.map(({ type, percent }) => (
				<div key={ type } className="flex items-center justify-between gap-6 py-3">
					<div className="flex flex-col gap-2 flex-1">
						<span className="font-mona text-slate-600 font-bold">{ type }</span>
						<div className="flex flex-row items-center gap-x-2">
							<div className="h-2 w-full bg-slate-600 rounded-full overflow-hidden">
								<div className="h-full bg-red-300" style={ {
									width: `${ percent }%`
								} } />
							</div>
							<span className="font-mona text-slate-600 font-semibold">{ percent }%</span>
						</div>
					</div>
				</div>
			))
		}
	</div>;
};

export default Suggestions;