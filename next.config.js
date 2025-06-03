/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow cross-origin requests in development
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },
  
  // Configure allowed dev origins
  experimental: {
    allowedDevOrigins: [
      'not-loading.preview.emergentagent.com',
      '351585b2-d812-466b-9cb2-72e58bcc2602.preview.emergentagent.com'
    ]
  }
}

module.exports = nextConfig