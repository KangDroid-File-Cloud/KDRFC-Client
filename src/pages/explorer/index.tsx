import { FileImageOutlined } from '@ant-design/icons';
import { Button, notification, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAsyncFn } from 'react-use';
import { BlobFileType, BlobProjection } from '../../apis';
import { fileApi } from '../../App';
import { BlobPathView } from '../../components/BlobPathView';
import { GeneralBlobOperation } from '../../components/GeneralBlobOperation';
import MainLayout from '../../components/MainLayout';
import { FILE_API_BASE_URL } from '../../configs/GlobalConfig';
import { AccessTokenPayload, parseJwtPayload } from '../../helpers/jwtHelper';
import { LocalStorageHelper } from '../../helpers/localStorageHelper';

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
          <GeneralBlobOperation
            searchParams={searchParams}
            rootId={jwtData.rootid}
            setBlobList={setBlobList}
          />
          <BlobPathView
            blobPathRef={blobPathRef}
            onBlobPathClick={(blob) => {
              searchParams.set('folderId', blob.id!);
              setSearchParams(searchParams, { replace: true });
              navigate(0);
            }}
            rootId={jwtData.sub}
          />
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
