import {
  FileImageOutlined,
  FolderAddOutlined,
  FolderOutlined,
  UploadOutlined,
  WarningTwoTone
} from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  Modal,
  notification,
  Table,
  Typography,
  Upload,
  UploadFile
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { UploadChangeParam } from 'antd/es/upload';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAsyncFn } from 'react-use';
import styled from 'styled-components';
import { BlobFileType, BlobProjection, CreateBlobFolderRequest } from '../../apis';
import { fileApi } from '../../App';
import MainLayout from '../../components/MainLayout';
import { FILE_API_BASE_URL } from '../../configs/GlobalConfig';
import { AccessTokenPayload, parseJwtPayload } from '../../helpers/jwtHelper';
import { LocalStorageHelper } from '../../helpers/localStorageHelper';

const CustomTypography = styled(Typography.Title)`
  display: inline;
  margin-left: 5px;
`;

function Explorer() {
  // State Area
  const [searchParams, setSearchParams] = useSearchParams();
  const [blobList, setBlobList] = useAsyncFn(async () => {
    let targetFolderId = searchParams.get('folderId') ?? jwtData.rootid;
    if (targetFolderId === '') targetFolderId = jwtData.rootid;
    const response = await fileApi.listFolderAsync(targetFolderId, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return response.data;
  }, []);
  const [blobPathRef, setBlobPathRef] = useAsyncFn(async () => {
    let targetFolderId = searchParams.get('folderId') ?? jwtData.rootid;
    if (targetFolderId === '') targetFolderId = jwtData.rootid;
    const response = await fileApi.resolveBlobPathAsync(targetFolderId, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Access Token, Auth Area
  const accessToken = LocalStorageHelper.getItem('accessToken');
  const jwtData = parseJwtPayload<AccessTokenPayload>(accessToken!);

  // Table Column Definition
  const columnData: ColumnsType<BlobProjection> = [
    {
      title: 'File Name',
      key: 'name',
      dataIndex: 'name',
      onCell: (data: BlobProjection) => {
        if (data.blobFileType === BlobFileType.NUMBER_1) {
          return {
            onClick: () => {
              onFolderBlobCellSelected(data.id!);
            }
          };
        }

        return {};
      }
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
          <div
            style={{
              display: 'flex',
              gap: '10px'
            }}
          >
            <Button danger onClick={() => onBlobDeleteButtonClicked(record)}>
              Delete
            </Button>
            {record.blobFileType === BlobFileType.NUMBER_0 && (
              <Button type="primary" onClick={() => onDownloadBlobButtonClicked(record)}>
                Download
              </Button>
            )}
          </div>
        );
      }
    }
  ];

  // Init: List folder when first accessed
  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    } else {
      setBlobPathRef();
      setBlobList();
    }
  }, []);

  // ACTION: On Folder Selected(Move to other page)
  const onFolderBlobCellSelected = (id: string) => {
    searchParams.set('folderId', id);
    setSearchParams(searchParams, { replace: true });
    navigate(0);
  };

  // ACTION: On Blob Deletion
  const [, onBlobDeleteButtonClicked] = useAsyncFn(
    async (record: BlobProjection) => {
      await fileApi.deleteBlobAsync(record.id!, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      notification.open({
        message: 'Success!',
        description: `Successfully deleted blob ${record.name}.`,
        icon: <FileImageOutlined />,
        placement: 'bottomRight'
      });
      setBlobList();
    },
    [accessToken]
  );

  // ACTION: On Folder Creation
  const [, onCreateFolderFormSubmit] = useAsyncFn(async (formValue: CreateBlobFolderRequest) => {
    const request: CreateBlobFolderRequest = {
      ...formValue,
      parentFolderId: searchParams.get('folderId') ?? jwtData.rootid
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

  // ACTION: On Modal Cancellation
  const onModalCanceled = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // ACTION: Upload
  const [, onUploadFileStart] = useAsyncFn(async (option: any) => {
    try {
      const targetFolderId = searchParams.get('folderId') ?? jwtData.rootid;
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

  // ACTION: OnDownloadBlob
  const [, onDownloadBlobButtonClicked] = useAsyncFn(async (file: BlobProjection) => {
    const fileEligibleResponse = await fileApi.downloadBlobCheck(file.id!, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const blobUrl = `${FILE_API_BASE_URL}/api/storage/${file.id!}/download?blobAccessToken=${
      fileEligibleResponse.data.token
    }`;
    const link = document.createElement('a');
    link.href = blobUrl;
    link.click();
    link.parentNode?.removeChild(link);
  });

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
            onCancel={onModalCanceled}
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
          <div style={{ marginTop: '10px' }}>
            {!blobPathRef.loading &&
              blobPathRef.value &&
              blobPathRef.value.map((blob) => {
                return (
                  <>
                    <CustomTypography level={5}>/</CustomTypography>
                    <CustomTypography
                      key={blob.id}
                      level={5}
                      onClick={() => {
                        searchParams.set('folderId', blob.id!);
                        setSearchParams(searchParams, { replace: true });
                        navigate(0);
                      }}
                    >
                      {blob.name === jwtData.sub ? 'root' : blob.name}
                    </CustomTypography>
                  </>
                );
              })}
          </div>
        </div>
        {!blobList.loading && blobList.value && (
          <Table
            style={{ width: '100%' }}
            dataSource={blobList.value}
            columns={columnData}
            rowKey="id"
          />
        )}
      </div>
    </MainLayout>
  );
}

export default Explorer;
