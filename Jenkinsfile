pipeline {
    agent any
    
    environment {
        DOCKERHUB_USER = 'harrskrt'  // Ganti dengan username DockerHub Anda
        BACKEND_IMAGE = "${DOCKERHUB_USER}/tp2-backend"
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/tp2-frontend"
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build & Push Backend') {
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub-login',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        bat """
                            echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin
                            docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} -f Dockerfile.backend .
                            docker tag ${BACKEND_IMAGE}:${BUILD_NUMBER} ${BACKEND_IMAGE}:latest
                            docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}
                            docker push ${BACKEND_IMAGE}:latest
                            echo "Backend image pushed successfully"
                        """
                    }
                }
            }
        }
        
        stage('Build & Push Frontend') {
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub-login',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        bat """
                            docker build -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} -f Dockerfile.frontend .
                            docker tag ${FRONTEND_IMAGE}:${BUILD_NUMBER} ${FRONTEND_IMAGE}:latest
                            docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}
                            docker push ${FRONTEND_IMAGE}:latest
                            echo "Frontend image pushed successfully"
                        """
                    }
                }
            }
        }
        
        stage('Deploy to AKS') {
            steps {
                withCredentials([file(credentialsId: 'aks-config', variable: 'KUBECONFIG')]) {
                    bat """
                        echo "Deploying to AKS..."
                        kubectl apply -f k8s/namespace.yaml
                        kubectl set image deployment/backend-deployment backend=${BACKEND_IMAGE}:${BUILD_NUMBER} -n kantin
                        kubectl set image deployment/frontend-deployment frontend=${FRONTEND_IMAGE}:${BUILD_NUMBER} -n kantin
                        kubectl rollout status deployment/backend-deployment -n kantin
                        kubectl rollout status deployment/frontend-deployment -n kantin
                    """
                }
            }
        }
    }
    
    post {
        always {
            bat 'docker logout'
        }
        success {
            echo 'Pipeline executed successfully!'
            bat 'echo "Deployment completed to AKS"'
        }
        failure {
            echo 'Pipeline failed. Check logs above.'
        }
    }
}