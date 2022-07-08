import AWS from 'aws-sdk';

export const s3 = new AWS.S3({
  endpoint: process.env.S3_ENDPOINT,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});
const bucket = process.env.S3_BUCKET;

export const getTempPath = (fileName: string) => {
  return `tmp/${fileName}`;
};

export const getImagesPath = (fileName: string) => {
  return `images/${fileName}`;
};

export const hasObject = (path: string) => {
  return new Promise<boolean>((resolve) => {
    s3.headObject(
      {
        Bucket: bucket,
        Key: path,
      },
      (err) => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      },
    );
  });
};

export const getObject = (path: string) => {
  return new Promise<AWS.S3.GetObjectOutput>((resolve, reject) => {
    s3.getObject(
      {
        Bucket: bucket,
        Key: path,
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      },
    );
  });
};

export const copyObject = (oldPath: string, newPath: string) => {
  return new Promise<AWS.S3.CopyObjectOutput>((resolve, reject) => {
    s3.copyObject(
      {
        Bucket: bucket,
        Key: newPath,
        CopySource: `${bucket}/${oldPath}`,
        ACL: 'public-read',
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      },
    );
  });
};

export const moveObject = async (oldPath: string, newPath: string) => {
  await copyObject(oldPath, newPath);
  await deleteObject(oldPath);
};

export const deleteObject = (path: string) => {
  return new Promise<AWS.S3.DeleteObjectOutput>((resolve, reject) => {
    s3.deleteObject(
      {
        Bucket: bucket,
        Key: path,
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      },
    );
  });
};
