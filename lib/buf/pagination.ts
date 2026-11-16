import {
  create,
  fromBinary,
  toBinary,
  type MessageInitShape
} from '@bufbuild/protobuf';
import { PaginationSchema, SortEnum } from '@interfaces/buf/pagination_pb';

export const defaultPagination: MessageInitShape<typeof PaginationSchema> = {
  pageIndex: 0,
  pageSize: 50,
  sort: SortEnum.NEWEST
};

export function encodePaginationParam(
  data?: MessageInitShape<typeof PaginationSchema>
) {
  const whereArgs = create(PaginationSchema, { ...defaultPagination, ...data });
  const binaryData = toBinary(PaginationSchema, whereArgs);
  const urlSafeBase64 = binaryData.toBase64({
    alphabet: 'base64url',
    omitPadding: true
  });

  return urlSafeBase64 as string;
}

export function decodePaginationParam(urlSafeBase64?: string | null) {
  const binaryData = Uint8Array.fromBase64(urlSafeBase64 || '', {
    alphabet: 'base64url'
  });

  const options = fromBinary(PaginationSchema, binaryData);

  return { ...defaultPagination, ...options };
}
