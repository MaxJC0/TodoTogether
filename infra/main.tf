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

  table_name = module.boards_table.table_name

  functions = {
    getBoards = {
      handler    = "index.handler"
      source_dir = "${path.root}/../../lambdas/getBoards"
      policies = [
        {
          effect    = "Allow"
          actions   = ["dynamodb:Scan", "dynamodb:Query"]
          resources = [module.boards_table.table_arn]
        }
      ]
    }

    createBoard = {
      handler    = "index.handler"
      source_dir = "${path.root}/../../lambdas/createBoard"
      policies = [
        {
          effect    = "Allow"
          actions   = ["dynamodb:PutItem"]
          resources = [module.boards_table.table_arn]
        }
      ]
    }

    updateBoard = {
      handler    = "index.handler"
      source_dir = "${path.root}/../../lambdas/updateBoard"
      policies = [
        {
          effect    = "Allow"
          actions   = ["dynamodb:UpdateItem"]
          resources = [module.boards_table.table_arn]
        }
      ]
    }

    deleteBoard = {
      handler    = "index.handler"
      source_dir = "${path.root}/../../lambdas/deleteBoard"
      policies = [
        {
          effect    = "Allow"
          actions   = ["dynamodb:DeleteItem"]
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
      lambda_arn = module.boards_lambdas.functions["getBoards"].arn
    }

    "POST /boards" = {
      lambda_arn = module.boards_lambdas.functions["createBoard"].arn
    }

    "PUT /boards/{id}" = {
      lambda_arn = module.boards_lambdas.functions["updateBoard"].arn
    }

    "DELETE /boards/{id}" = {
      lambda_arn = module.boards_lambdas.functions["deleteBoard"].arn
    }
  }
}
