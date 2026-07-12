UPDATE "_prisma_migrations"
SET
  "checksum"            = '81ea04a693c692e493abd0934fa6cec7639a7c9528b435ffd1b1b46852205bac',
  "finished_at"         = NOW(),
  "logs"                = NULL,
  "rolled_back_at"      = NULL,
  "applied_steps_count" = 1
WHERE "migration_name" = '20260629153640_update_roll_id_account_table';
