provider "aws" {
  region = "ap-south-1"
}

# Security group to allow SSH access
resource "aws_security_group" "devops_sg" {
  name = "devops_sg"

  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 8080
    to_port = 8080
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# EC2 instance
resource "aws_instance" "devops_server" {
  ami           = "ami-05d2d839d4f73aafb" 
  instance_type = "t3.micro"
  key_name = "Haven-AI"
  vpc_security_group_ids = [aws_security_group.devops_sg.id]

  root_block_device {
    volume_size = 20
  }
  tags = {
    Name = "real-estate-devops"
  }
}