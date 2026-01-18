
-- CreateTable
CREATE TABLE "media_containers" (
    "id" UUID NOT NULL,
    "ownerId" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "published_post_id" UUID,

    CONSTRAINT "media_containers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_files" (
    "id" UUID NOT NULL,
    "container_id" UUID,
    "size" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "media_files_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "media_files" ADD CONSTRAINT "media_files_container_id_fkey" FOREIGN KEY ("container_id") REFERENCES "media_containers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
