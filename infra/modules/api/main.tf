########################################
# HTTP API
########################################

resource "aws_apigatewayv2_api" "this" {
  name          = "${var.environment}-${var.project_name}http-api"
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
# Stage
########################################

resource "aws_apigatewayv2_stage" "stage" {
  api_id      = aws_apigatewayv2_api.this.id
  name        = var.environment
  auto_deploy = true
  tags        = var.tags
}

