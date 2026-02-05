########################################
# HTTP API
########################################

resource "aws_apigatewayv2_api" "this" {
  name          = "${var.environment}-${var.project_name}-http-api"
  protocol_type = "HTTP"
  tags          = var.tags
}

########################################
# Integrations (one per route)
########################################

resource "aws_apigatewayv2_integration" "integrations" {
  for_each = var.routes

  api_id                 = aws_apigatewayv2_api.this.id
  integration_type       = "AWS_PROXY"
  integration_uri        = each.value.lambda_arn
  payload_format_version = "2.0"
}
########################################
# Routes (one per route)
########################################

resource "aws_apigatewayv2_route" "routes" {
  for_each = var.routes

  api_id    = aws_apigatewayv2_api.this.id
  route_key = each.key
  target    = "integrations/${aws_apigatewayv2_integration.integrations[each.key].id}"
}

########################################
# CloudWatch Log Group for API Gateway
########################################

resource "aws_cloudwatch_log_group" "api_gw" {
  name              = "/aws/api-gw/${var.environment}-${var.project_name}"
  retention_in_days = 14
  tags              = var.tags
}

########################################
# Stage with Access Logging
########################################

resource "aws_apigatewayv2_stage" "stage" {
  api_id      = aws_apigatewayv2_api.this.id
  name        = var.environment
  auto_deploy = true
  tags        = var.tags

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw.arn
    format = jsonencode({
      requestId   = "$context.requestId"
      routeKey    = "$context.routeKey"
      httpMethod  = "$context.httpMethod"
      status      = "$context.status"
      path        = "$context.path"
      error       = "$context.error.message"
      integration = "$context.integrationErrorMessage"
      ip          = "$context.identity.sourceIp"
      userAgent   = "$context.identity.userAgent"
    })
  }
}
