output "functions" {
  value = {
    for name, fn in aws_lambda_function.lambda :
    name => {
      arn  = fn.arn
      name = fn.function_name
    }
  }
}

