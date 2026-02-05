variable "environment" {
  type = string
}

variable "project_name" {
  type = string
}

variable "functions" {
  description = "Map of lambda functions to create"
  type = map(object({
    handler    = string
    source_dir = string
    policies = list(object({
      effect    = string
      actions   = list(string)
      resources = list(string)
    }))
  }))
}

variable "tags" {
  type    = map(string)
  default = {}
}

variable "table_name" {
  type = string
}

variable "api_execution_arn" {
  type = string
}
