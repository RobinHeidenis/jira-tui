import { Text } from "ink";
import { useGetIssueTransitionsQuery } from "../api/get-issue-transitions.query.js";
import type { Option } from "./select-modal.js";
import { SelectModal } from "./select-modal.js";

export const SelectLaneModal = ({
  issueId,
  selectedStatusId,
  onSelect,
  onClose,
}: {
  issueId: string;
  selectedStatusId: string;
  onSelect: (status: Option) => void;
  onClose: () => void;
}) => {
  const { data: transitions } = useGetIssueTransitionsQuery(issueId);

  if (!transitions || transitions.length === 0) {
    return <Text>Loading...</Text>;
  }

  const selectedTransition = transitions.find(
    (transition) => transition.to.id === selectedStatusId,
  );

  return (
    <SelectModal
      options={transitions.map((transition) => ({
        label: transition.to.name,
        value: transition.id,
        extraData: {
          newStatusId: transition.to.id,
        },
      }))}
      title={"Select lane"}
      footer={" Confirm: <return> | Cancel: q"}
      selected={selectedTransition!.id}
      onSelect={(choice: Option) => {
        if (choice.value !== selectedTransition!.id) {
          onSelect(choice);
        } else {
          onClose();
        }
      }}
      onClose={onClose}
    />
  );
};
