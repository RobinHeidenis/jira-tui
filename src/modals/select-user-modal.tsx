import { Text } from "ink";
import { useGetUsersQuery } from "../api/get-users.query.js";
import { type Option, SelectModal } from "./select-modal.js";

export const SelectUserModal = ({
  issueId,
  selectedUserId,
  onSelect,
  onClose,
}: {
  issueId: string;
  selectedUserId: string;
  onSelect: (user: Option) => void;
  onClose: () => void;
}) => {
  const { data: users } = useGetUsersQuery(issueId);

  if (!users || users.length === 0) {
    return <Text>Loading...</Text>;
  }

  return (
    <SelectModal
      options={users
        .map((user) => ({
          label: user.displayName,
          value: user.accountId,
        }))
        .sort((a, b) => a.label.localeCompare(b.label))}
      title={"Select user"}
      footer={" Confirm: <return> | Cancel: q"}
      selected={selectedUserId}
      onSelect={onSelect}
      onClose={onClose}
    />
  );
};
