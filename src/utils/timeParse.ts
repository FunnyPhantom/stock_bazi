import logger from "./logger";
import mj from "moment-jalaali";

const concatString = (s1: string, s2: string) => s1 + s2;
const distinct = <T>(value: T, index: number, arr: Array<T>): boolean =>
  arr.indexOf(value) === index;

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
    //todo: This is a bug, we need to match regex by parenthesis and then itereate over each group to get samplingEnteries
    .split(",")
    .map((s) => s.trim());
  if (tokens.length === 1) return parseSamplingExact(tokens);
  if (tokens.length === 3) return parseSamplingRange(tokens);
  throw new Error("lengh of sample entry was incorrect");
};

const parseSamplingInput = (samplingInputString: string) => {
  const whiteSpaceTrimmed = samplingInputString.trim();
  const samplingEnteries = whiteSpaceTrimmed
    .substring(1, whiteSpaceTrimmed.length - 1)
    .split(",")
    .flatMap(parseSamplingEntry)
    .filter(distinct)
    .sort();
  console.log(samplingEnteries);
};

parseSamplingInput("[(08:51:22),(8:31:00, 12:00:00, 20m)]");
