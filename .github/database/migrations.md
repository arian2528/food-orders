# Migrations and Seeding Strategy

## Migrations
- Prisma Migrate is used to manage and version database schema changes.
- Migrations are created and stored in the `prisma/migrations/` directory.
- To create and apply a new migration during development:
  ```sh
  npx prisma migrate dev --name <migration-name>
  ```
- To apply all pending migrations in production:
  ```sh
  npx prisma migrate deploy
  ```
- Migrations ensure your database schema is consistent across all environments.

## Seeding
- Prisma supports seeding your database with initial or test data.
- The seed script is defined in `prisma/seed.ts` (or `prisma/seed.js`).
- To run the seed script:
  ```sh
  npx prisma db seed
  ```
- Use seeding to populate the database with default users, roles, products, or demo data for development and testing.

## Best Practices
- Keep migrations and seed scripts under version control.
- Regularly run migrations and seeds in development and CI environments.
- Review and test migrations before deploying to production.

For more details, see the [Prisma Migrate docs](https://www.prisma.io/docs/concepts/components/prisma-migrate) and [Seeding docs](https://www.prisma.io/docs/guides/database/seed-database).
