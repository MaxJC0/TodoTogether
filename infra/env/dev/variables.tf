variable "region" {
  type    = string
  default = "eu-central-1"
}

variable "project_name" {
  type    = string
  default = "Todo-App"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "tags" {
  type = map(string)
  default = {
    Project     = "Todo-App"
    Environment = "dev"
  }
}

variable "table_name" {
  type    = string
  default = "boards"
}
