import { Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlobFileType, BlobProjection } from '../../apis';
import { fileApi } from '../../App';
import MainLayout from '../../components/MainLayout';
import { AccessTokenPayload, parseJwtPayload } from '../../helpers/jwtHelper';
import { LocalStorageHelper } from '../../helpers/localStorageHelper';

const columnData: ColumnsType<BlobProjection> = [
  {
    title: 'File ID',
    key: 'id',
    dataIndex: 'id'
  },
  {
    title: 'File Type',
    key: 'blobFileType',
    dataIndex: 'blobFileType',
    render: (record: BlobFileType) => {
      return record === BlobFileType.NUMBER_0 ? 'Folder' : 'File';
    }
  },
  {
    title: 'Upload Date',
    key: 'uploadDate',
    dataIndex: 'uploadDate'
  }
];

function Explorer() {
  const navigate = useNavigate();
  const [blobList, setBlobList] = useState<BlobProjection[]>();
  const accessToken = LocalStorageHelper.getItem('accessToken');
  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    } else {
      const jwtData = parseJwtPayload<AccessTokenPayload>(accessToken);
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
        <Table style={{ width: '100%' }} dataSource={blobList} columns={columnData} />
      </div>
    </MainLayout>
  );
}

export default Explorer;
