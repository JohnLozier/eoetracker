"use server";

import { constructError, floorDate, isBetween } from "~/lib/utils";

import Cerebras from "@cerebras/cerebras_cloud_sdk";
import { Day } from "./types/day";
import DayJS from "dayjs";
import { auth } from "@clerk/nextjs/server";
import { days } from "~/lib/db/schema";
import { db } from "~/lib/db";
import { eq } from "drizzle-orm";
import toJSON from "zod-to-json-schema";
import { z } from "zod";

const cerebras = new Cerebras({
	apiKey: process.env.CEREBRAS_API_KEY
});

const askCerebras = async <T>({ schema, prompt, system }: {
	schema: z.ZodSchema<T>,
	prompt: string,
	system: string
}) => {
	try {
		const { choices } = await cerebras.chat.completions.create({
			model: "gpt-oss-120b",
			messages: [
				{ role: "system", content: system },
				{ role: "user", content: prompt }
			],
			reasoning_effort: "low",
			response_format: {
				type: "json_schema",
				json_schema: {
					name: "schema",
					schema: toJSON(schema)
				}
			}
		});

		const json = JSON.parse((choices as {
			message: {
				content: string;
			}
		}[])[0].message.content);

		return schema.parse(json) as T;
	} catch (e) {
		console.error(e);
	}
};

export const estimateSeverity = async (input: string): Promise<{
	successful: true;
	result: number;
} | {
	successful: false;
	reason: string;
	result?: undefined;
}> => {
	const { userId } = await auth();

	if (!userId) return constructError("Unauthorized");
	if (!isBetween(input.length, 1, 256)) return constructError("Invalid input");

	const { rating } = await askCerebras({
		schema: z.object({
			rating: z.number().min(0).max(10).int().describe("The estimated severity rating")
		}),
		prompt: input,
		system: "You will be given a descriptions of a persons with EoE (Eosinophilic esophagitis) symptoms for one day. Provide a rating of the severity of the symptoms on a scale of 0 to 10, where 0 is no symptoms and 10 is the worst symptoms possible. Take into account that the symptoms should be related to EoE and rate them accordingly. Ex: Choking and extreme acid reflux would be a 10, while mild acid reflux would be a 3-4."
	}) ?? {
		rating: 0
	};

	return {
		successful: true,
		result: rating
	};
};

export const setToday = async (options: Exclude<Day, "symptoms">, timezone: string): Promise<{
	successful: true;
	result: Array<{
		type: "Dairy" | "Wheat" | "Soy" | "Egg" | "Nuts" | "Fish/Shellfish" | "Corn" | "Meat" | "Other";
		percent: number;
	}>;
} | {
	successful: false;
	reason: string;
	result?: undefined;
}> => {
	try {
		const { userId } = await auth();

		if (!userId) return constructError("Unauthorized");
		if (options.severity == undefined || !isBetween(options.severity, 0, 10)) return constructError("Invalid severity");
		if (!options.date || !isBetween(DayJS(options.date).unix(), 0, Date.now() + 86_400)) return constructError("Invalid date");
		if (!isBetween(options.foods.length, 1, 256)) return constructError("Invalid food description");
		if (!isBetween(timezone.length, 1, 100)) return constructError("Invalid timezone");
		const day = floorDate(DayJS(options.date).unix(), timezone);

		const { foods } = await askCerebras({
			schema: z.object({
				foods: z.array(z.object({
					type: z.enum([
						"Dairy",
						"Wheat",
						"Soy",
						"Egg",
						"Nuts",
						"Fish/Shellfish",
						"Corn",
						"Meat",
						"Other"
					]).describe("Trigger food category"),
					percent: z.number().min(0).max(100).describe("Percentage of the food in the diet")
				}))
			}),
			system: "You will be given a list of the foods and meals consumed in a single day for a person with EoE (Eosinophilic esophagitis). Break down the foods consumed into the trigger categories listed and provide an estimation of what percentage of the diet each category represents for that specific day. The categories are: Dairy, Wheat, Soy, Egg, Nuts, Fish/Shellfish, Corn, Meat, Other. Do not reuse categories. The total percentage must add up to 100%.",
			prompt: options.foods.map(({ time, description }) =>
				`description of food: ${ description }
				time of meal: ${ time ?? "unspecified" }`
			).join("\n")
		}) ?? {
			foods: []
		};

		const trimmed = foods.slice(0, 8);

		const foodsMap = Object.fromEntries(trimmed.map(food => [
			food.type,
			food.percent
		]));

		await db
			.insert(days)
			.values({
				userId: userId!,
				symptoms: options.severity,
				triggers: foodsMap,
				date: day
			})
			.onConflictDoUpdate({
				target: [ days.userId, days.date ],
				set: {
					symptoms: options.severity,
					triggers: foodsMap
				}
			});

		return {
			successful: true,
			result: trimmed
		};
	} catch (error) {
		console.error(error);

		return constructError((error as Error).message);
	}
};

export const getAll = async (): Promise<{
	successful: true;
	result: {
		data: Array<{
			symptoms: number;
			triggers: Record<"Dairy" | "Wheat" | "Soy" | "Egg" | "Nuts" | "Fish/Shellfish" | "Corn" | "Meat" | "Other", number>;
			date: number;
		}>;
		triggers: Array<{
			type: "Dairy" | "Wheat" | "Soy" | "Egg" | "Nuts" | "Fish/Shellfish" | "Corn" | "Meat" | "Other";
			percent: number;
		}>;
	};
} | {
	successful: false;
	reason: string;
	result?: undefined;
}> => {
	try {
		const { userId } = await auth();

		if (!userId) return constructError("Unauthorized");

		const data = await db
			.select({
				symptoms: days.symptoms,
				triggers: days.triggers,
				date: days.date
			})
			.from(days)
			.where(eq(days.userId, userId!));

		let triggers: {
			type: "Dairy" | "Wheat" | "Soy" | "Egg" | "Nuts" | "Fish/Shellfish" | "Corn" | "Meat" | "Other";
			percent: number;
		}[] = [];

		if (data.length >= 14) {
			triggers = (await askCerebras({
				schema: z.object({
					triggers: z.array(z.object({
						type: z.enum([
							"Dairy",
							"Wheat",
							"Soy",
							"Egg",
							"Nuts",
							"Fish/Shellfish",
							"Corn",
							"Meat",
							"Other"
						]),
						percent: z.number().min(0).max(100).describe("Estimated percentage likelihood to be a trigger for the patient")
					}))
				}),
				system: "You will be given the history of the triggers consumed (in a percentage of that days diet) and symptom severity experienced of a person with EoE (Eosinophilic esophagitis). Provide a list of the most likely trigger food categories and an estimated percentage likelihood based on the trends of their data. The possible categories are: Dairy, Wheat, Soy, Egg, Nuts, Fish/Shellfish, Corn, Meat, Other. Do not reuse categories. Only return categories that have a decent likelihood of being triggers. Take into account that symptoms of EoE may only appear days to weeks after consuming a trigger food and that effects from triggers can be cumulative or have started before the symptom tracking.",
				prompt: data.map(({ triggers, symptoms, date }) =>
					`date: ${ date }
					symptom severity: ${ symptoms }
					triggers consumed: [
						${ Object.entries(triggers).map(([ type, percent ]) => `${ type }: ${ percent }%`).join("\d\t") }
					]`
				).join("\n\d")
			}))?.triggers ?? [];
		};

		return {
			successful: true,
			result: {
				data,
				triggers
			}
		};
	} catch (error) {
		console.error(error);

		return constructError((error as Error).message);
	};
};
