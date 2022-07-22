import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

export const s3 = new S3Client({
  endpoint: process.env.AWS_S3_ENDPOINT,
});
const bucket = process.env.AWS_S3_BUCKET;

export const getTempPath = (fileName: string) => {
  return `tmp/${fileName}`;
};

export const getImagesPath = (fileName: string) => {
  return `images/${fileName}`;
};

export async function hasObject(path: string) {
  return await s3.send(
    new HeadObjectCommand({
      Bucket: bucket,
      Key: path,
    }),
  );
}

export async function getObject(path: string) {
  return await s3.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: path,
    }),
  );
}

export async function copyObject(oldPath: string, newPath: string) {
  return await s3.send(
    new CopyObjectCommand({
      Bucket: bucket,
      Key: newPath,
      CopySource: `${bucket}/${oldPath}`,
      ACL: 'public-read',
    }),
  );
}

export async function moveObject(oldPath: string, newPath: string) {
  await copyObject(oldPath, newPath);
  await deleteObject(oldPath);
}

export async function deleteObject(path: string) {
  return await s3.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: path,
    }),
  );
}
