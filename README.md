# ECS fargate deployment for a Flask & Node app

## Project Versions

### Version 1
- Manual AWS setup
- ECS Fargate
- No Infrastructure as Code

### Version 2 (Current)
- Terraform-based IaC
- ECS Fargate
- Modular architecture

Infrastructure code is available under:
`infra/`

## About the App:
Application is built for Celpip practice with synonyms and antonyms for various fancy words.
The tech stack involved:
- Python Flask
- React JS

## The Workflow for ECS deployment
![aws_ecs_rec](https://github.com/user-attachments/assets/cdb7f6b2-e90a-43c9-9af8-750638e7ab2f)

<img width="2421" height="827" alt="graph" src="https://github.com/user-attachments/assets/0407ad0d-3b0e-4fc8-a457-a8dff98129e2" />

As described, the traffic initally flows in through the Application load balancer which transfers the traffic via listeners to the Target groups. We've got two target groups configured:
- Tg1: For the frontend (default)
- Tg2: For backend testing (priority 10) - configured with rule: if the url has a substring "/api/*" in its path, the traffic flow redirection will go to any existing valid API endpoint.

### The Load Balancer:
<img width="1592" height="840" alt="Screenshot 2025-12-20 225846" src="https://github.com/user-attachments/assets/09036f92-ce89-4d10-982f-c4195d2858a1" />

### Target groups:
<img width="1680" height="839" alt="Screenshot 2025-12-20 225929" src="https://github.com/user-attachments/assets/a6431f0a-a006-469f-8fe8-083851ea7b4b" />
<img width="1637" height="804" alt="Screenshot 2025-12-20 225923" src="https://github.com/user-attachments/assets/1c333cc2-c88f-478e-803a-fc09fe65dd90" />

The ECS is our orchestrator here, so obviously thats the entity which holds our application. But, in terms of developer workflow, the changes acquired in <i>main</i> branch or pull requests that goes to </i>main</i>, will trigger a github action workflow which is our CI/CD here. 

### Github Action:
The CI/CD centre for our project, which carries the updated code, packages, dependencies and:
- Builds a new docker image revising the layers configured with cache.
- Pushes the new image to Dockerhub which is our source of truth for holding our artifacts.
- Creates a new deployment into ECS
The .github/workflows/deploy.yml: Is the YAML script which carries out the deployment process for our without webhooks.
For the purpose of inducing some security initiatives, its a best practice to use environmental variables instead of having secrets in command-line which could be easily traced out when used in build machine with process queries.
<img width="880" height="406" alt="Screenshot 2025-12-20 223812" src="https://github.com/user-attachments/assets/c26f509a-7e53-4a3a-8679-a0a44465af37" />


### ECS Cluster:
This holds our services which has our microservices running. Every service has a task running (1 minimum) to start and keep it up & running. Fundamentally, it provides a platform.
Our ECS cluster is a Fargate environment (i.e., Infrastructure config will be taken care by AWS itself) as we know this is a small-scale application with no much traffic. 
<img width="1618" height="790" alt="Screenshot 2025-12-20 225757" src="https://github.com/user-attachments/assets/08f18f67-5996-4f5d-a2a6-2878a8c8446e" />

<b>Services</b>
<img width="1607" height="861" alt="Screenshot 2025-12-20 225750" src="https://github.com/user-attachments/assets/5a0d1eb3-11d0-4b69-be89-e30f6fdcc1dc" />
<img width="1583" height="820" alt="Screenshot 2025-12-20 225732" src="https://github.com/user-attachments/assets/64f46e08-9ac5-4066-a609-85e23a141b16" />

### Task Definitions:
This carries the data of Target groups, load balancer so that an IP would be assigned to the target group from ECS which will be registered as target for managing inbound and outbound traffic.

<b>Frontend Task</b>
<img width="1608" height="864" alt="Screenshot 2025-12-20 225830" src="https://github.com/user-attachments/assets/8dbf07d3-c32c-49a2-8118-6c9ae1ae4508" />

<b>Backend Task</b>
<img width="1589" height="880" alt="Screenshot 2025-12-20 225820" src="https://github.com/user-attachments/assets/3c43f370-849d-4f47-96ab-400300686ba3" />


