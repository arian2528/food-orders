/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  images: {
    domains: ['localhost', 'images.unsplash.com', 'via.placeholder.com']
  }
}

module.exports = nextConfig
