import { FileImageOutlined, UploadOutlined, WarningTwoTone } from '@ant-design/icons';
import { Button, Form, Input, Modal, notification, Table, Typography, Upload } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlobFileType, BlobProjection, CreateBlobFolderRequest } from '../../apis';
import { fileApi } from '../../App';
import MainLayout from '../../components/MainLayout';
import { AccessTokenPayload, parseJwtPayload } from '../../helpers/jwtHelper';
import { LocalStorageHelper } from '../../helpers/localStorageHelper';

function Explorer() {
  const navigate = useNavigate();
  const [blobList, setBlobList] = useState<BlobProjection[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const accessToken = LocalStorageHelper.getItem('accessToken');
  const jwtData = parseJwtPayload<AccessTokenPayload>(accessToken!);
  const columnData: ColumnsType<BlobProjection> = [
    {
      title: 'File Name',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: 'File Type',
      key: 'blobFileType',
      dataIndex: 'blobFileType',
      render: (record: BlobFileType) => {
        return record === BlobFileType.NUMBER_0 ? 'File' : 'Folder';
      }
    },
    {
      title: 'Upload Date',
      key: 'uploadDate',
      dataIndex: 'uploadDate'
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: BlobProjection) => {
        return (
          <Button
            danger
            onClick={() => {
              fileApi
                .deleteBlobAsync(record.id!, {
                  headers: {
                    Authorization: `Bearer ${accessToken}`
                  }
                })
                .then(() => {
                  notification.open({
                    message: 'Success!',
                    description: `Successfully deleted image ${record.name}.`,
                    icon: <FileImageOutlined />,
                    placement: 'bottomRight'
                  });
                  setBlobList(blobList?.filter((a) => a.id !== record.id));
                });
            }}
          >
            Delete
          </Button>
        );
      }
    }
  ];

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    } else {
      fileApi
        .listFolderAsync(jwtData.rootid, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        .then((response) => {
          setBlobList(response.data);
        });
    }
  }, []);

  const [form] = Form.useForm();

  const handleCreateFolderForm = (formValue: CreateBlobFolderRequest) => {
    const request: CreateBlobFolderRequest = {
      ...formValue,
      parentFolderId: jwtData.rootid
    };

    fileApi
      .createFolderAsync(request, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then((response) => {
        notification.open({
          message: 'Success!',
          description: 'Succesfully created directory.',
          icon: <FileImageOutlined />,
          placement: 'bottomRight'
        });
        setBlobList([...blobList!, response.data]);
        setIsModalOpen(false);
        form.resetFields();
      });
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <MainLayout>
      <div
        style={{
          display: 'flex',
          margin: '24px',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          gap: '10px'
        }}
      >
        <Typography.Title level={2}>All Files</Typography.Title>
        <div>
          <Upload
            listType="text"
            name="file"
            showUploadList={false}
            customRequest={(option) => {
              fileApi
                .uploadBlobFileAsync(jwtData.rootid, option.file as File, {
                  headers: {
                    Authorization: `Bearer ${accessToken}`
                  }
                })
                .then((res) => option.onSuccess!(res))
                .catch((e) => option.onError!(e));
            }}
            onChange={(info) => {
              if (info.file.status === 'done') {
                notification.open({
                  message: 'Success!',
                  description: 'Successfully uploaded image.',
                  icon: <FileImageOutlined />,
                  placement: 'bottomRight'
                });
                setBlobList([...blobList!, info.file.response.data]);
              } else if (info.file.status === 'error') {
                notification.open({
                  message: 'Error!',
                  description: 'Error while uploading image. Please try again.',
                  icon: <WarningTwoTone />,
                  placement: 'bottomRight'
                });
              }
            }}
          >
            <Button type="primary" icon={<UploadOutlined />}>
              Upload File
            </Button>
          </Upload>
          <Button
            type="primary"
            icon={<UploadOutlined />}
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
            onCancel={handleModalCancel}
          >
            <Form<CreateBlobFolderRequest>
              form={form}
              layout="vertical"
              onFinish={handleCreateFolderForm}
            >
              <Form.Item label="Folder name" name="folderName" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Form>
          </Modal>
        </div>
        <Table style={{ width: '100%' }} dataSource={blobList} columns={columnData} rowKey="id" />
      </div>
    </MainLayout>
  );
}

export default Explorer;
