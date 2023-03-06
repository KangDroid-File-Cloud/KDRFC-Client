import { Typography } from 'antd';
import { AsyncState } from 'react-use/lib/useAsyncFn';
import styled from 'styled-components';
import { BlobProjection } from '../apis';

interface BlobPathProps {
  blobPathRef: AsyncState<BlobProjection[]>;
  onBlobPathClick: (blobProjection: BlobProjection) => void;
  rootId: string | undefined;
}

const CustomTypography = styled(Typography.Title)`
  display: inline;
  margin-left: 5px;
`;

export function BlobPathView(pathProps: BlobPathProps) {
  const { blobPathRef, onBlobPathClick, rootId } = pathProps;
  return (
    <div style={{ marginTop: '10px' }}>
      {!blobPathRef.loading &&
        blobPathRef.value &&
        blobPathRef.value.map((blob) => {
          return (
            <>
              <CustomTypography level={5}>/</CustomTypography>
              <CustomTypography key={blob.id} level={5} onClick={() => onBlobPathClick(blob)}>
                {blob.name === rootId ? 'root' : blob.name}
              </CustomTypography>
            </>
          );
        })}
    </div>
  );
}
