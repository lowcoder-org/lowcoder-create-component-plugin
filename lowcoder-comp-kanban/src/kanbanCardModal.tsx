import Flex from "antd/es/flex"
import Input from "antd/es/input"
import Modal from "antd/es/modal"
import Select from "antd/es/select"
import Typography from "antd/es/typography"
import React, { useEffect } from "react"
import { useState } from "react"

interface IProps {
  open: boolean;
  data: Record<string, string>;
  statusOptions: Array<Record<string, string>>;
  assigneeOptions: Array<Record<string, string>>;
  onOk: (data: Record<string, string>) => void;
  onCancel: () => void;
}

const KanbanCardModal = ({
  open,
  data,
  onOk,
  onCancel,
  statusOptions,
  assigneeOptions,
}: IProps) => {
  const [dialogData, setDialogData] = useState<Record<string,string>>({});

  // const handleOk = () => {
  //   setIsModalOpen(false);
  // };

  // const handleCancel = () => {
  //   onCancel();
  // };

  useEffect(() => {
    if (open) { setDialogData(data); }
    else { setDialogData({}) }
  }, [open]);

  return (
    <Modal
      title="Edit Task"
      open={open}
      onOk={() => onOk(dialogData)}
      onCancel={onCancel}
      okText="Update"
      maskClosable={false}
    >
      <Flex vertical gap={10}>
        <Typography.Title level={5}>Title</Typography.Title>
        <Input
          placeholder={'Label'}
          onChange={(e) =>
            setDialogData((prev) => ({...prev, label: e.target.value}))
          }
          value={dialogData.label}
        />
        <Typography.Title level={5}>Status</Typography.Title>
        <Select
          value={dialogData.status}
          // style={{ width: 120 }}
          onChange={(value) =>
            setDialogData((prev) => ({...prev, status: value}))
          }
          options={statusOptions}
        />
        <Typography.Title level={5}>Assignee</Typography.Title>
        <Select
          value={dialogData.assignee}
          onChange={(value) =>
            setDialogData((prev) => ({...prev, assignee: value}))
          }
          options={assigneeOptions}
        />
        <Typography.Title level={5}>Summary</Typography.Title>
        <Input
          placeholder={'Summary'}
          onChange={(e) =>
            setDialogData((prev) => ({...prev, summary: e.target.value}))
          }
          value={dialogData.summary}
        />
        <Typography.Title level={5}>Tags</Typography.Title>
        <Input
          placeholder={'Tags'}
          onChange={(e) =>
            setDialogData((prev) => ({...prev, tags: e.target.value}))
          }
          value={dialogData.tags}
        />
      </Flex>
    </Modal>
  )
}

export default React.memo(KanbanCardModal);