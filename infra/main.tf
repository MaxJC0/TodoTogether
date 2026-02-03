########################################
# Common tags
########################################
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

########################################
# Lambda Functions
########################################
module "boards_lambdas" {
  source       = "./modules/lambda"
  environment  = var.environment
  project_name = var.project_name
  tags         = local.common_tags

  functions = {
    get = {
      handler    = "index.handler"
      source_dir = "${path.root}/../../lambdas/get"
      policies = [
        {
          effect    = "Allow"
          actions   = ["dynamodb:GetItem", "dynamodb:Query"]
          resources = [module.boards_table.table_arn]
        }
      ]
    }
  }
}

########################################
# HTTP API (universal)
########################################

module "api" {
  source       = "./modules/api"
  environment  = var.environment
  project_name = var.project_name
  tags         = local.common_tags

  routes = {
    "GET /boards" = {
      lambda_arn = module.boards_lambdas.functions["get"].arn
    }
  }
}
