locals {
  common_tags = merge(
    var.tags,
    {
      Environment = var.environment
      Project     = var.project_name
    }
  )
}
########################################
# DynamoDB table for boards
########################################

module "boards_table" {
  source = "./modules/dynamodb"

  table_name = "${var.environment}-${var.table_name}"
  hash_key   = "id"

  attributes = [
    {
      name = "id"
      type = "S"
    }
  ]

  tags = local.common_tags
}
