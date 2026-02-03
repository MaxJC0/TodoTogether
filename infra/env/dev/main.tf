module "app" {
  source      = "../../"
  region      = var.region
  environment = var.environment

  table_name = var.table_name
}
