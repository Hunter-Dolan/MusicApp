type TrackEntry = {url: string, id: string};

import AWS from 'aws-sdk';

import Config from '../config';

const S3 = new AWS.S3();

export class DataLoader {

  public static listTracks():Promise<TrackEntry[]> {
    return new Promise((resolve, reject) => {
      S3.listObjectsV2(
        {
          Prefix: Config.S3_PREFIX,
          Bucket: Config.S3_BUCKET!,
          MaxKeys: 1000,
        },
        (err, data) => {
          if (err || !data.Contents) {
            return reject(err);
          }

          const tracks:TrackEntry[] = data.Contents.filter((item: AWS.S3.Object) => {
            if (!item.Key) {
              return false;
            }

            return item.Key.endsWith('.mp3');
          }).map((item: AWS.S3.Object):TrackEntry => {
            return {
              url: Config.S3_URL_PREFIX + item.Key,
              id: item.Key!.replace(Config.S3_PREFIX, '').replace('.mp3', ''),
            };
          });

          resolve(tracks);
        }
      );
    });
  }
}
