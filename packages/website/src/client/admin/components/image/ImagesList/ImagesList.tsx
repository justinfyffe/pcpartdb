import { DEFAULT_LIST_IMAGES_LIMIT, Image } from '@pcpartdb/shared';
import {
  formatFileSize,
  formatImageDimensions,
  getImagePath,
} from 'packages/website/src/client/image/utils';
import { InfoAlert } from 'packages/website/src/client/shared/components/Alert/InfoAlert';
import { Img } from 'packages/website/src/client/shared/components/Img/Img';
import { TextInput } from 'packages/website/src/client/shared/components/Input/TextInput';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import {
  ImagesListContext,
  useImagesListContextBuilder,
} from './ImagesListContext';
import { ImagesListFilters } from './ImagesListFilters';

interface ImagesListProps {
  isDialog?: boolean;
  onSelect?: (image: Image) => void;
}

export const ImagesList: FunctionComponent<ImagesListProps> = (props) => {
  const { isDialog, onSelect } = props;

  const context = useImagesListContextBuilder();
  const offset = context?.query?.pagination?.offset ?? 0;
  const limit = context?.query?.pagination?.limit ?? DEFAULT_LIST_IMAGES_LIMIT;

  return (
    <ImagesListContext.Provider value={context}>
      <section className="flex flex-col gap-4 h-full">
        <ImagesListFilters />

        <div className="grow overflow-auto">
          <InfiniteScroll
            useWindow={isDialog ? false : true}
            pageStart={0}
            loadMore={context?.loadPage}
            hasMore={
              !context?.loading &&
              (offset + limit < context?.totalImages ||
                context?.totalImages === -1)
            }
            loader={
              <div className="loader" key={0}>
                Loading ...
              </div>
            }
            initialLoad={false}
            element="div"
          >
            <Table border>
              <THead>
                <Tr sticky>
                  <Th className="max-w-50">Preview</Th>
                  <Th className="text-center">ID</Th>
                  <Th>Name</Th>
                  <Th>Path</Th>
                  <Th>Size</Th>
                  <Th>Dimensions</Th>
                </Tr>
              </THead>
              <TBody>
                {context?.images?.map((image) => (
                  <Tr
                    key={image.id}
                    className="cursor-pointer"
                    onClick={() => onSelect(image)}
                  >
                    <Td className="max-w-50">
                      <Img loading="lazy" src={image} alt={image.name} />
                    </Td>
                    <Td className="text-center">{image.id}</Td>
                    <Td>{image.name}</Td>
                    <Td>
                      <TextInput value={getImagePath(image)} disabled />
                    </Td>
                    <Td>{formatFileSize(image.fileSize)}</Td>
                    <Td>{formatImageDimensions(image.width, image.height)}</Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          </InfiniteScroll>

          {context?.images?.length === 0 && (
            <InfoAlert>There are no images.</InfoAlert>
          )}
        </div>
      </section>
    </ImagesListContext.Provider>
  );
};
