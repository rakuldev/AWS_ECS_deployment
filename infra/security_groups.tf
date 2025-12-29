resource "aws_security_group" "alb_sg" {
  name        = "alb-sg"
  description = "Allow Load balancer inbound traffic and all outbound traffic to ECS Cluster"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "Inbound traffic with port 80 for HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Inbound traffic with port 80 for HTTP"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Forward traffic to ECS Tasks"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "alb-sg"
  }
}

resource "aws_security_group" "ecs_frontend_task_sg" {
  name        = "ecs-frontend-task-sg"
  description = "Allow ECS Cluster inbound traffic and all outbound to internet"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description     = "Inbound traffic with port 80 for HTTP"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    description = "Forward traffic to Internet"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ecs-frontend-task-sg"
  }
}


resource "aws_security_group" "ecs_backend_task_sg" {
  name        = "ecs-backend-task-sg"
  description = "Allow ECS Cluster inbound traffic and all outbound to internet"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description     = "Inbound traffic with port 80 for HTTP"
    from_port       = 5000
    to_port         = 5000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    description = "Forward traffic to Internet"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ecs-backend-task-sg"
  }
}