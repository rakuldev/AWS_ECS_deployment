data "aws_region" "current" {}

locals {
    region = data.aws_region.current.name
}

resource "aws_cloudwatch_log_group" "ecs_frontend" {
  name              = "/ecs/ecs-frontend"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "ecs_backend" {
  name              = "/ecs/ecs-backend"
  retention_in_days = 7
}

#-----------ECS Cluster-----------#
resource "aws_ecs_cluster" "celpip_ecs_cluster" {
  name = "celpip-ecs-cluster"

  tags = {
    Name = "ecs-fargate-cluster"
  }
}

#-----------------Backend Task Definition-----------------#
resource "aws_ecs_task_definition" "ecs_backend_task_def" {
  family                   = "backend"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"

  cpu    = 256
  memory = 512

  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn      = null

  container_definitions = jsonencode([
    {
      "name" : "backend"
      "image" : "rakul21/celpip_app_backend:latest"

      "essential" : true

      portMappings = [
        {
          containerPort = 5000
          protocol      = "tcp"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs_backend.name
          awslogs-region        = local.region
          awslogs-stream-prefix = "ecs"
        }
      }

  }])

  tags = {
    Name = "ecs-backend-task-definition"
  }
}

#-----------------Frontend Task Definition-----------------#
resource "aws_ecs_task_definition" "ecs_frontend_task_def" {
  family                   = "frontend"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"

  cpu    = 256
  memory = 512

  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn      = null

  container_definitions = jsonencode([
    {
      "name" : "frontend"
      "image" : "rakul21/celpip_app_frontend:latest"

      "essential" : true

      portMappings = [
        {
          containerPort = 80
          protocol      = "tcp"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs_frontend.name
          awslogs-region        = local.region
          awslogs-stream-prefix = "ecs"
        }
      }

  }])

  tags = {
    Name = "ecs-frontend-task-definition"
  }
}

#-------------- AWS ECS Service -------------#

#============== ECS frontend ================#
resource "aws_ecs_service" "frontend" {
  name            = "frontend-service"
  cluster         = aws_ecs_cluster.celpip_ecs_cluster.id
  task_definition = aws_ecs_task_definition.ecs_frontend_task_def.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = data.aws_subnets.default_public.ids
    security_groups  = [aws_security_group.ecs_frontend_task_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.ecs_frontend_tg.arn
    container_name   = "frontend"
    container_port   = 80
  }

  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200

  depends_on = [aws_lb_listener.http]
}

#============== ECS back end ================#
resource "aws_ecs_service" "backend" {
  name            = "backend-service"
  cluster         = aws_ecs_cluster.celpip_ecs_cluster.id
  task_definition = aws_ecs_task_definition.ecs_backend_task_def.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = data.aws_subnets.default_public.ids
    security_groups  = [aws_security_group.ecs_backend_task_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.ecs_backend_tg.arn
    container_name   = "backend"
    container_port   = 5000
  }

  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200

  depends_on = [aws_lb_listener.http, aws_lb_listener_rule.host_based_routing_backend]
}

