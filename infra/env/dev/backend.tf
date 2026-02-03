terraform {
  backend "s3" {
    bucket = "todotogether-tfstate"
    key    = "dev/backend.tfstate"
    region = "eu-central-1"
  }
}
