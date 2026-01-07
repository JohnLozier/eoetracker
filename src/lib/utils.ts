import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import DayJS from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

DayJS.extend(utc);
DayJS.extend(timezone);

export const cn = (...inputs: ClassValue[]) =>
	twMerge(clsx(inputs));

export const floorDate = (date: number, timezone: string) =>
	DayJS(date * 1000).tz(timezone).startOf("day").valueOf();

export const getTimezone = () =>
	DayJS.tz.guess();

export const isBetween = (value: number | string, min: number, max: number) => {
	const length = typeof value == "number" ? value : value.length;

	return length >= min && length <= max;
};

export const constructError = (message: string) => ({
	successful: false as const,
	reason: message
});