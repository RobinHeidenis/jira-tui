import { Box, Text, useInput } from "ink";
import React, { useState } from "react";

export interface Option {
  label: string;
  value: string;
}
export const SelectModal = ({
  title,
  footer,
  options,
  selected,
  onSelect,
  onClose,
}: {
  title: string;
  footer: string;
  options: Option[];
  selected: string;
  onSelect: (selected: Option) => void;
  onClose: () => void;
}) => {
  const [focused, setFocused] = useState(0);

  const maxLength = Math.max(
    ...options.map((option) => option.label.length + 6),
    title.length + 6,
    footer.length + 6,
  );

  useInput((input, key) => {
    if (input === "j" || key.downArrow || (key.ctrl && input === "n")) {
      setFocused(Math.min(options.length - 1, focused + 1));
    } else if (input === "k" || key.upArrow || (key.ctrl && input === "p")) {
      setFocused(Math.max(0, focused - 1));
    } else if (key.return || (key.ctrl && input === "y")) {
      onSelect(options[focused]!);
      onClose();
    } else if (input === "q" || key.escape) {
      onClose();
    }
  });

  return (
    <Box
      flexDirection="column"
      position="absolute"
      borderStyle={"round"}
      borderColor={"green"}
      marginLeft={146 / 2 - maxLength / 2}
      marginTop={10}
    >
      <Text>
        {"   "}
        {title.padEnd(maxLength - 3, " ")}
      </Text>
      {options
        .toSorted((a, b) => a.label.localeCompare(b.label))
        .map((option, index) => {
          const text =
            `   ${index === focused ? "> " : " "}${option.label} `.padEnd(
              maxLength,
              " ",
            );

          return (
            <Text
              key={option.value}
              color={
                index === focused
                  ? "blue"
                  : selected === option.value
                    ? "green"
                    : undefined
              }
            >
              {text}
            </Text>
          );
        })}
      <Text>{"".padEnd(maxLength, " ")}</Text>
      <Text color={"blueBright"}>
        {"   "}
        {footer.padEnd(maxLength - 3, " ")}
      </Text>
    </Box>
  );
};
