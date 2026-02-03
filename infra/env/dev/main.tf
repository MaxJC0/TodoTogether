module "app" {
  source       = "../../"
  region       = var.region
  project_name = var.project_name
  environment  = var.environment
  tags         = var.tags

  table_name = var.table_name
}
