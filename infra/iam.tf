#---------------------------------- Task Execution Role ----------------------------------#

#------------------------ IAM Role -----------------------#
data "aws_iam_policy_document" "ecs_task_execution" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "ecs_task_execution_role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_execution.json
}

#------------------------ IAM Policy ----------------------#
data "aws_iam_policy_document" "ecs_task_execution_pd" {
  statement {
    effect = "Allow"
    actions = [
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "ecs_task_execution_policy" {
  name        = "ecs_task_execution_policy"
  description = "Policy to allow ECS to Execute the services with task definitions"
  policy      = data.aws_iam_policy_document.ecs_task_execution_pd.json
}


#======================= Attaching Policy to the IAM ROLE ======================#
resource "aws_iam_role_policy_attachment" "ecs_task_execution_attached_role" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.ecs_task_execution_policy.arn
}

