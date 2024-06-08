import { useMemo, useState } from "react";
import { matchSorter } from "match-sorter";

export type Option = Record<string, unknown> & {
  label?: string;
  value: string | number | null;
};
export type OptionWithIcon = Option & { icon?: React.ReactNode };
export type MentionOption = OptionWithIcon & {
  type: string;
  value: string;
  description?: string;
};

type UseComboboxProps = {
  value: string;
  options: Array<OptionWithIcon | MentionOption>;
};

type UseComboboxReturnType = {
  open: boolean;
  setOpen: (value: boolean) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  matches: Array<OptionWithIcon | MentionOption>;
};

export const useCombobox = ({
  value,
  options,
}: UseComboboxProps): UseComboboxReturnType => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const matches = useMemo(() => {
    if (!searchValue) {
      return options;
    }
    const keys = ["label", "value"];
    const matches = matchSorter(options, searchValue, { keys });
    // Radix Select does not work if we don't render the selected item, so we
    // make sure to include it in the list of matches.
    const selectedItem = options.find((currentItem) => currentItem.value === value);
    if (selectedItem && !matches.includes(selectedItem)) {
      matches.push(selectedItem);
    }
    return matches;
  }, [searchValue, value, options]);

  return {
    open,
    setOpen,
    searchValue,
    setSearchValue,
    matches,
  };
}
