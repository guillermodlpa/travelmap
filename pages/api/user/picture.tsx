import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ManagementClient } from 'auth0';
import multiparty from 'multiparty';
import { v2 as cloudinary } from 'cloudinary';
import { CUSTOM_CLAIM_APP_USER_ID } from '../../../util/tokenCustomClaims';
import { getPrismaClient } from '../../../lib/prisma';

type ErrorResponse = { error: string };
type ParsedFile = {
  fieldName: string;
  originalFilename: string;
  path: string;
  headers: { [headerName: string]: string };
  size: number;
};
type ParsedFilesOutput = { file: ParsedFile[] } | undefined;

// POST /api/user/picture
const handlePost = async (req: NextApiRequest, res: NextApiResponse<{} | ErrorResponse>) => {
  const session = getSession(req, res);
  if (session == undefined) {
    return res.status(500).json({ error: 'Internal error' });
  }

  const userId = session.user[CUSTOM_CLAIM_APP_USER_ID];

  return new Promise<ParsedFile>((resolve, reject) => {
    const form = new multiparty.Form();
    form.parse(req, (parsingError, fields, files: ParsedFilesOutput) => {
      if (files?.file?.[0]) {
        resolve(files.file[0]);
      } else {
        reject(new Error('No files parsed'));
      }
    });
  })
    .then(async (file) => {
      // here we upload to Cloudinary
      configureCloudinary();

      const folderName = {
        production: 'profile',
        development: 'profile-development',
        test: 'profile-test',
      }[process.env.NODE_ENV];

      const response = await cloudinary.uploader.upload(file.path, {
        resource_type: 'image',
        // the saved path is the user ID. That way, next uploads will override previous
        public_id: `${folderName}/${userId}`, // e.g., profile/a12b3c-4d5e6f-7g8h9i
        transformation: { width: 200, height: 200, gravity: 'face', crop: 'thumb', zoom: 0.8 },
        overwrite: true,
      });
      const { secure_url: secureUrl } = response;

      const prisma = getPrismaClient();
      await prisma.user.update({
        where: { id: userId },
        data: { pictureUrl: secureUrl },
      });

      // Update the picture in Auth0 as well for consistency
      const management = createAuth0ManagementClient();
      await management
        .updateAppMetadata({ id: session.user.sub }, { picture: secureUrl })
        .catch((error) => {
          // an error with this operation shouldn't affect the user. We don't propagate the error
          console.error(error);
        });

      res.status(200).json({
        pictureUrl: secureUrl,
      });
    })
    .catch((error: Error) => {
      res.status(500).json({ error: error.message });
    });
};

const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

const createAuth0ManagementClient = (): ManagementClient => {
  if (
    !process.env.AUTH0_MTM_BACKEND_DOMAIN ||
    !process.env.AUTH0_MTM_BACKEND_CLIENT_ID ||
    !process.env.AUTH0_MTM_BACKEND_CLIENT_SECRET
  ) {
    throw Error('Missing environment variables');
  }
  return new ManagementClient({
    domain: process.env.AUTH0_MTM_BACKEND_DOMAIN,
    clientId: process.env.AUTH0_MTM_BACKEND_CLIENT_ID,
    clientSecret: process.env.AUTH0_MTM_BACKEND_CLIENT_SECRET,
    scope: 'delete:users',
  });
};

export default withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  const handlers: {
    [method: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
  } = {
    POST: handlePost,
  };
  try {
    return req.method && handlers[req.method]
      ? await handlers[req.method](req, res)
      : res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal error' });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};
