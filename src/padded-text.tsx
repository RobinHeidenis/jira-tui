import { Text } from "ink";
import { ansiRegex } from "./lib/adf-renderer.js";

export const PaddedText = ({
  text,
  maxLength = 20,
  textProps = {},
}: {
  text: string;
  maxLength?: number;
  textProps?: Partial<Parameters<typeof Text>[0]>;
}) => {
  const textLengthWithoutFormatting = text.replaceAll(ansiRegex(), "").length;
  const padded =
    text + " ".repeat(Math.max(0, maxLength - textLengthWithoutFormatting));

  return <Text {...textProps}>{padded}</Text>;
};
