export interface Day {
	date?: Date;
	symptoms?: string;
	severity?: number;
	foods: {
		time?: "breakfast" | "lunch" | "dinner" | "snack";
		description: string;
	}[];
};