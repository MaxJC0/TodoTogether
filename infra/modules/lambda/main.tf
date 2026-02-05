########################################
# IAM roles
########################################

resource "aws_iam_role" "lambda_role" {
  for_each = var.functions

  name = "${var.environment}-${var.project_name}-${each.key}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = var.tags
}

########################################
# IAM inline policies
########################################

resource "aws_iam_role_policy" "lambda_policy" {
  for_each = var.functions

  name = "${var.environment}-${var.project_name}-${each.key}-policy"
  role = aws_iam_role.lambda_role[each.key].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      for p in each.value.policies : {
        Effect   = p.effect
        Action   = p.actions
        Resource = p.resources
      }
    ]
  })
}

########################################
# Allow API Gateway to invoke Lambda
########################################

resource "aws_lambda_permission" "allow_apigw" {
  for_each = var.functions

  statement_id  = "AllowAPIGatewayInvoke-${each.key}"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda[each.key].function_name
  principal     = "apigateway.amazonaws.com"

  # API execution ARN must be passed into this module
  source_arn = "${var.api_execution_arn}/*/*"
}


########################################
# Package lambda code automatically
########################################

data "archive_file" "lambda_zip" {
  for_each = var.functions

  type        = "zip"
  source_dir  = each.value.source_dir
  output_path = "${path.module}/.terraform-lambda-${each.key}.zip"
}

########################################
# Lambda functions
########################################

resource "aws_lambda_function" "lambda" {
  for_each = var.functions

  function_name = "${var.environment}-${var.project_name}-${each.key}"
  role          = aws_iam_role.lambda_role[each.key].arn
  handler       = each.value.handler
  runtime       = "nodejs20.x"

  filename         = data.archive_file.lambda_zip[each.key].output_path
  source_code_hash = data.archive_file.lambda_zip[each.key].output_base64sha256

  environment {
    variables = {
      TABLE_NAME = var.table_name
    }
  }

  tags = var.tags
}

########################################
# CloudWatch log groups 
########################################

resource "aws_cloudwatch_log_group" "lambda_logs" {
  for_each = var.functions

  name              = "/aws/lambda/${aws_lambda_function.lambda[each.key].function_name}"
  retention_in_days = 14
  tags              = var.tags
}

