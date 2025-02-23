import { Text } from "ink";
import React from "react";
import { useGetUsersQuery } from "./api/get-users.query.js";
import { SelectModal, type Option } from "./select-modal.js";

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
      options={users.map((user) => ({
        label: user.displayName,
        value: user.accountId,
      }))}
      title={"Select user"}
      footer={" Confirm: <return> | Cancel: q"}
      selected={selectedUserId}
      onSelect={onSelect}
      onClose={onClose}
    />
  );
};
