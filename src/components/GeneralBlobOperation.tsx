import {
  FileImageOutlined,
  FolderAddOutlined,
  FolderOutlined,
  UploadOutlined,
  WarningTwoTone
} from '@ant-design/icons';
import { Button, Form, Input, Modal, notification, Upload } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';
import { useState } from 'react';
import { useAsyncFn } from 'react-use';
import { BlobProjection, CreateBlobFolderRequest } from '../apis';
import { fileApi } from '../App';
import { LocalStorageHelper } from '../helpers/localStorageHelper';

interface GeneralBlobOperationProps {
  searchParams: URLSearchParams;
  rootId: string;
  setBlobList: () => Promise<BlobProjection[]>;
}

export function GeneralBlobOperation(props: GeneralBlobOperationProps) {
  const accessToken = LocalStorageHelper.getItem('accessToken');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { searchParams, rootId, setBlobList } = props;

  // ACTION: On Upload File Start.
  const [, onUploadFileStart] = useAsyncFn(async (option: any) => {
    try {
      const targetFolderId = searchParams.get('folderId') ?? rootId;
      const response = await fileApi.uploadBlobFileAsync(targetFolderId, option.file as File, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      option.onSuccess!(response);
    } catch (e) {
      option.onError!(e);
    }
  });

  // ACTION: OnUploading
  const onUploading = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === 'done') {
      notification.open({
        message: 'Success!',
        description: 'Successfully uploaded blob.',
        icon: <FileImageOutlined />,
        placement: 'bottomRight'
      });
      setBlobList();
    } else if (info.file.status === 'error') {
      notification.open({
        message: 'Error!',
        description: 'Error while uploading blob. Please try again.',
        icon: <WarningTwoTone />,
        placement: 'bottomRight'
      });
    }
  };

  // ACTION: On Folder Creation
  const [, onCreateFolderFormSubmit] = useAsyncFn(async (formValue: CreateBlobFolderRequest) => {
    const request: CreateBlobFolderRequest = {
      ...formValue,
      parentFolderId: searchParams.get('folderId') ?? rootId
    };

    await fileApi.createFolderAsync(request, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    notification.open({
      message: 'Success!',
      description: `Succesfully created directory: ${request.folderName}`,
      icon: <FolderOutlined />,
      placement: 'bottomRight'
    });
    setBlobList();
    setIsModalOpen(false);
    form.resetFields();
  });

  return (
    <>
      <Upload
        listType="text"
        name="file"
        showUploadList={false}
        customRequest={onUploadFileStart}
        onChange={onUploading}
      >
        <Button type="primary" icon={<UploadOutlined />}>
          Upload File
        </Button>
      </Upload>
      <Button
        type="primary"
        icon={<FolderAddOutlined />}
        onClick={() => setIsModalOpen(true)}
        style={{
          marginLeft: '10px'
        }}
      >
        Create Folder
      </Button>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={form.submit}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
      >
        <Form<CreateBlobFolderRequest>
          form={form}
          layout="vertical"
          onFinish={onCreateFolderFormSubmit}
        >
          <Form.Item label="Folder name" name="folderName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
