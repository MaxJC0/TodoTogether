output "invoke_url" {
  value = aws_apigatewayv2_stage.stage.invoke_url
}

output "api_execution_arn" {
  value = aws_apigatewayv2_api.this.execution_arn
}
