import aws from 'aws-sdk';

const s3 = new aws.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
});

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { fileName, fileType } = req.query;

    const s3Params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `products/${Date.now()}-${fileName}`,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read',
    };

    try {
        const uploadUrl = await s3.getSignedUrlPromise('putObject', s3Params);
        const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Params.Key}`;

        res.status(200).json({ uploadUrl, fileUrl });
    } catch (error) {
        console.error('S3 Signed URL Error:', error);
        res.status(500).json({ error: 'Failed to generate upload URL' });
    }
}
