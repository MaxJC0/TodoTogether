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
}
