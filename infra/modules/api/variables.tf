variable "environment" {
  type = string
}

variable "project_name" {
  type = string
}

variable "routes" {
  description = "Map of HTTP routes to Lambda ARNs"
  type = map(object({
    lambda_arn = string
  }))
}

variable "tags" {
  type    = map(string)
  default = {}
}

