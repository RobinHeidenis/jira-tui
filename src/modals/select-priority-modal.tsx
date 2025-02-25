import { Text } from "ink";
import { useGetPrioritiesQuery } from "../api/get-priorities.query.js";
import type { Option } from "./select-modal.js";
import { SelectModal } from "./select-modal.js";

export const SelectPriorityModal = ({
  projectId,
  selectedPriorityId,
  onSelect,
  onClose,
}: {
  projectId: string;
  selectedPriorityId: string;
  onSelect: (user: Option) => void;
  onClose: () => void;
}) => {
  const { data: priorities } = useGetPrioritiesQuery(projectId);

  if (!priorities || priorities.length === 0) {
    return <Text>Loading...</Text>;
  }

  return (
    <SelectModal
      options={priorities.map((priority) => ({
        label: priority.name,
        value: priority.id,
        color: priority.statusColor,
      }))}
      title={"Select priority"}
      footer={" Confirm: <return> | Cancel: q"}
      selected={selectedPriorityId}
      onSelect={(choice: Option) => {
        if (choice.value !== selectedPriorityId) {
          onSelect(choice);
        } else {
          onClose();
        }
      }}
      onClose={onClose}
    />
  );
};
