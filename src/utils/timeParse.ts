import logger from "./logger";
import mj from "moment-jalaali";

const concatString = (s1: string, s2: string) => s1 + s2;
const distinct = <T>(value: T, index: number, arr: Array<T>): boolean =>
  arr.indexOf(value) === index;

const compareAsc = (a: number, b: number) => a - b;

const parseSamplingExact = (tokens: string[]) => {
  const samplingTime = tokens[0];
  return [
    Number.parseInt(
      samplingTime
        .split(":")
        .map((s) => s.trim())
        .reduce(concatString)
    ),
  ];
};

const parseStepToStandardDurationFormat = (stepInput: string) => {
  stepInput = stepInput.toLowerCase();

  if (!["h", "m", "s"].includes(stepInput[stepInput.length - 1]))
    stepInput + "m"; // default step is minute
  const modifier = stepInput[stepInput.length - 1];
  const stepValue = stepInput
    .substring(0, stepInput.length - 1)
    .padStart(2, "0");
  if (modifier === "h") return `${stepValue}:00:00`;
  if (modifier === "m") return `00:${stepValue}:00`;
  if (modifier === "s") return `00:00:${stepValue}`;
  throw new Error("modifier was not 'h', 'm' or 's'");
};

const parseSamplingRange = (tokens: string[]) => {
  const startTime = tokens[0];
  const endTime = tokens[1];
  const step = tokens[2];

  const startM = mj(startTime, "HH:mm:ss");
  startM.set("year", 2020);
  startM.set("month", 2);
  startM.set("day", 2);
  const endM = mj(endTime, "HH:mm:ss");
  endM.set("year", 2020);
  endM.set("month", 2);
  endM.set("day", 2);
  const stepDuration = mj.duration(parseStepToStandardDurationFormat(step));

  console.log(startM);

  const resultFormat = "HHmmss";

  const samplingTimes: Array<string> = [];

  while (endM.isAfter(startM)) {
    samplingTimes.push(startM.format(resultFormat));
    startM.add(stepDuration);
  }

  return samplingTimes.map((st) => Number.parseInt(st));
};

const parseSamplingEntry = (samplingEntryInput: string) => {
  const trimmed = samplingEntryInput.trim();
  const tokens = trimmed
    .substring(1, trimmed.length - 1)
    .split(",")
    .map((s) => s.trim());
  if (tokens.length === 1) return parseSamplingExact(tokens);
  if (tokens.length === 3) return parseSamplingRange(tokens);
  throw new Error("lengh of sample entry was incorrect");
};

const getSamplingEntryInputOutOfSamplingInput = (
  samplingInputString: string
): string[] => {
  const trimmed = samplingInputString.trim();
  const withoutBracks = trimmed.substring(0, trimmed.length - 1);
  const entries: string[] = [];
  let pos = withoutBracks.indexOf("(", 0);
  while (withoutBracks.indexOf("(", pos) !== -1) {
    const secondPos = withoutBracks.indexOf(")", pos) + 1;
    entries.push(withoutBracks.substring(pos, secondPos));
    pos = secondPos;
  }
  return entries;
};

export const parseSamplingInput = (samplingInputString: string) =>
  getSamplingEntryInputOutOfSamplingInput(samplingInputString)
    .flatMap(parseSamplingEntry)
    .filter(distinct)
    .sort(compareAsc);
