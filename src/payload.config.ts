import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

/** Payload */
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

/** Lexical */
import { lexicalEditor } from '@payloadcms/richtext-lexical'

/** Plugins */
import { s3Storage } from '@payloadcms/storage-s3'

/** Content */
import * as collections from '@/collections'

import type { UploadCollectionSlug } from 'payload'
import type { S3StorageOptions } from '@payloadcms/storage-s3'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadCollectionSlugs: UploadCollectionSlug[] = [
  'images',
]

export default buildConfig({
  // serverURL: process.env.NEXT_PUBLIC_SITE_URL,
  secret: process.env.PAYLOAD_SECRET,
  debug: process.env.NODE_ENV !== 'production',
  admin: {
    meta: {
      // favicon: '/favicon/safari-pinned-tab.svg',
      titleSuffix: `| ${process.env.SITE_NAME}`,
    },
    user: collections.Users.slug,
  },
  db: mongooseAdapter({
    url: `mongodb://0.0.0.0/${process.env.DATABASE_NAME}`,
  }),
  collections: Object.values(collections),
  editor: lexicalEditor({}),
  routes: {
    api: process.env.NEXT_PUBLIC_PAYLOAD_API_ROUTE,
  },
  sharp,
  typescript: {
    outputFile: path.resolve(__dirname, '../payload-types.d.ts'),
  },
  upload: {
    limits: {
      fileSize: 50e6,
    },
  },
  plugins: [
    s3Storage({
      collections: uploadCollectionSlugs.reduce(
        (acc, collectionSlug) => ({
          ...acc,
          [collectionSlug]: {
            disablePayloadAccessControl: true,
            prefix: collectionSlug,
            generateFileURL: ({ filename, prefix }) =>
              filename
                ? `https://${process.env.CLOUDFRONT_DOMAIN}/${prefix}/${filename}`
                : null,
          } as S3StorageOptions['collections'][keyof S3StorageOptions['collections']],
        }),
        {},
      ),
      bucket: process.env.S3_BUCKET,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
        region: process.env.S3_REGION,
      },
    }),
  ],
})
