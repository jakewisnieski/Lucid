-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('epic', 'feature', 'story');

-- CreateEnum
CREATE TYPE "SourceKind" AS ENUM ('slack', 'email', 'notes');

-- CreateEnum
CREATE TYPE "GateResult" AS ENUM ('pass', 'fail');

-- CreateEnum
CREATE TYPE "Verdict" AS ENUM ('pass', 'weak', 'fail');

-- CreateEnum
CREATE TYPE "VerdictSource" AS ENUM ('lint', 'critic');

-- CreateEnum
CREATE TYPE "CorrectionAction" AS ENUM ('accept', 'edit', 'reject');

-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('open', 'answered');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "backlogs" (
    "id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "title" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "backlogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source_inputs" (
    "id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "backlog_id" UUID NOT NULL,
    "kind" "SourceKind" NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "source_inputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "backlog_id" UUID NOT NULL,
    "type" "ItemType" NOT NULL,
    "parent_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_revisions" (
    "id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "revision_no" INTEGER NOT NULL,
    "as_a" TEXT NOT NULL,
    "want" TEXT NOT NULL,
    "so_that" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_revisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acceptance_criteria" (
    "id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "revision_id" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "acceptance_criteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessments" (
    "id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "backlog_id" UUID NOT NULL,
    "revision_id" UUID,
    "gate_result" "GateResult" NOT NULL,
    "readiness_score" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "characteristic_verdicts" (
    "id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "assessment_id" UUID NOT NULL,
    "characteristic" TEXT NOT NULL,
    "verdict" "Verdict" NOT NULL,
    "rationale" TEXT,
    "suggested_fix" TEXT,
    "source" "VerdictSource" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "characteristic_verdicts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corrections" (
    "id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "from_revision_id" UUID,
    "to_revision_id" UUID,
    "action" "CorrectionAction" NOT NULL,
    "actor" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "corrections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clarifying_questions" (
    "id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "backlog_id" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "status" "QuestionStatus" NOT NULL DEFAULT 'open',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clarifying_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "backlogs_owner_id_idx" ON "backlogs"("owner_id");

-- CreateIndex
CREATE INDEX "source_inputs_owner_id_idx" ON "source_inputs"("owner_id");

-- CreateIndex
CREATE INDEX "source_inputs_backlog_id_idx" ON "source_inputs"("backlog_id");

-- CreateIndex
CREATE INDEX "items_owner_id_idx" ON "items"("owner_id");

-- CreateIndex
CREATE INDEX "items_backlog_id_idx" ON "items"("backlog_id");

-- CreateIndex
CREATE INDEX "items_parent_id_idx" ON "items"("parent_id");

-- CreateIndex
CREATE INDEX "item_revisions_owner_id_idx" ON "item_revisions"("owner_id");

-- CreateIndex
CREATE INDEX "item_revisions_item_id_idx" ON "item_revisions"("item_id");

-- CreateIndex
CREATE UNIQUE INDEX "item_revisions_item_id_revision_no_key" ON "item_revisions"("item_id", "revision_no");

-- CreateIndex
CREATE INDEX "acceptance_criteria_owner_id_idx" ON "acceptance_criteria"("owner_id");

-- CreateIndex
CREATE INDEX "acceptance_criteria_revision_id_idx" ON "acceptance_criteria"("revision_id");

-- CreateIndex
CREATE INDEX "assessments_owner_id_idx" ON "assessments"("owner_id");

-- CreateIndex
CREATE INDEX "assessments_backlog_id_idx" ON "assessments"("backlog_id");

-- CreateIndex
CREATE INDEX "assessments_revision_id_idx" ON "assessments"("revision_id");

-- CreateIndex
CREATE INDEX "characteristic_verdicts_owner_id_idx" ON "characteristic_verdicts"("owner_id");

-- CreateIndex
CREATE INDEX "characteristic_verdicts_assessment_id_idx" ON "characteristic_verdicts"("assessment_id");

-- CreateIndex
CREATE INDEX "corrections_owner_id_idx" ON "corrections"("owner_id");

-- CreateIndex
CREATE INDEX "corrections_item_id_idx" ON "corrections"("item_id");

-- CreateIndex
CREATE INDEX "clarifying_questions_owner_id_idx" ON "clarifying_questions"("owner_id");

-- CreateIndex
CREATE INDEX "clarifying_questions_backlog_id_idx" ON "clarifying_questions"("backlog_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backlogs" ADD CONSTRAINT "backlogs_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "source_inputs" ADD CONSTRAINT "source_inputs_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "source_inputs" ADD CONSTRAINT "source_inputs_backlog_id_fkey" FOREIGN KEY ("backlog_id") REFERENCES "backlogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_backlog_id_fkey" FOREIGN KEY ("backlog_id") REFERENCES "backlogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_revisions" ADD CONSTRAINT "item_revisions_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_revisions" ADD CONSTRAINT "item_revisions_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acceptance_criteria" ADD CONSTRAINT "acceptance_criteria_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acceptance_criteria" ADD CONSTRAINT "acceptance_criteria_revision_id_fkey" FOREIGN KEY ("revision_id") REFERENCES "item_revisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_backlog_id_fkey" FOREIGN KEY ("backlog_id") REFERENCES "backlogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_revision_id_fkey" FOREIGN KEY ("revision_id") REFERENCES "item_revisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characteristic_verdicts" ADD CONSTRAINT "characteristic_verdicts_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characteristic_verdicts" ADD CONSTRAINT "characteristic_verdicts_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corrections" ADD CONSTRAINT "corrections_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corrections" ADD CONSTRAINT "corrections_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corrections" ADD CONSTRAINT "corrections_from_revision_id_fkey" FOREIGN KEY ("from_revision_id") REFERENCES "item_revisions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corrections" ADD CONSTRAINT "corrections_to_revision_id_fkey" FOREIGN KEY ("to_revision_id") REFERENCES "item_revisions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clarifying_questions" ADD CONSTRAINT "clarifying_questions_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clarifying_questions" ADD CONSTRAINT "clarifying_questions_backlog_id_fkey" FOREIGN KEY ("backlog_id") REFERENCES "backlogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
