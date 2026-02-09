// import { or, isSuperAdmin, isAdmin } from '~/access'
// import { UploadTitle } from '~/fields'
// import { hashFilename } from '~/hooks'

import type { CollectionConfig, ImageSize } from 'payload'
import type { Image } from 'payload-types'

const widths = [320, 800, 1200, 1600, 2000]
const aspectRatios = {
  auto: null,
  square: 1 / 1,
  landscape: 4 / 3,
  portrait: 3 / 4,
  wide: 16 / 9,
}

const secondarySizes = [
  {
    name: 'opengraph',
    width: 1200,
    height: 630,
  },
  {
    name: 'mediaThumb_80',
    width: 80,
    height: 80,
  },
  {
    name: 'mediaThumb_192',
    width: 192,
    height: 192,
  },
  {
    name: 'mediaThumb_512',
    width: 512,
    height: 512,
  },
  {
    name: 'mediaThumb_1024',
    width: 1024,
    height: 1024,
  },
]

export const Images: CollectionConfig = {
  slug: 'images',
  admin: {
    group: '📷 Media',
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'title', 'updatedAt'],
    listSearchableFields: ['title'],
    enableRichTextLink: false,
  },
  access: {
    read: () => true,
    // delete: or(isSuperAdmin, isAdmin),
  },
  // hooks: {
  //   beforeOperation: [hashFilename],
  // },
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    adminThumbnail: ({ doc }) =>
      (doc as unknown as Image).sizes?.square_320?.url || null,
    imageSizes: [
      ...Object.entries(aspectRatios).reduce<ImageSize[]>(
        (acc, [key, value]) => {
          return [
            ...acc,
            ...widths.map((width) => {
              return {
                name: `${key}_${width}`,
                width,
                height: value ? Math.floor(width / value) : value,
                formatOptions: {
                  format: 'jpeg',
                  options: {
                    quality: 85,
                    force: true,
                  },
                },
                admin: {
                  disableListColumn: true,
                  disableListFilter: true,
                },
              } as ImageSize
            }),
          ]
        },
        [],
      ),
      ...secondarySizes.map(
        (size) =>
          ({
            ...size,
            withoutEnlargement: false,
            formatOptions: {
              format: 'jpeg',
              options: {
                quality: 75,
                force: true,
              },
            },
            admin: {
              disableListColumn: true,
              disableListFilter: true,
            },
          }) as ImageSize,
      ),
    ],
  },
  fields: [
    // UploadTitle,
    // {
    //   name: 'helper',
    //   type: 'ui',
    //   admin: {
    //     components: {
    //       Field: '@/collections/Images/components/HelperField',
    //     },
    //     disableListColumn: true,
    //   },
    // },
    // {
    //   name: 'description',
    //   type: 'text',
    //   admin: {
    //     components: {
    //       Description: '@/collections/Images/components/DescriptionHelp',
    //     },
    //   },
    // },
  ],
}
