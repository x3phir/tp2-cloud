pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'harrskrt' // Change this
        DOCKER_HUB_REPO_BACKEND = 'tp2-backend:latest'
        DOCKER_HUB_REPO_FRONTEND = 'tp2-frontend:latest'
        KUBECONFIG_CREDENTIAL_ID = 'aks-kubeconfig'
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
                    sh "docker build -t ${DOCKER_HUB_USER}/${DOCKER_HUB_REPO_BACKEND}:latest -f Dockerfile.backend ."
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh "echo $PASS | docker login -u $USER --password-stdin"
                    }
                    sh "docker push ${DOCKER_HUB_USER}/${DOCKER_HUB_REPO_BACKEND}:latest"
                }
            }
        }

        stage('Build & Push Frontend') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_HUB_USER}/${DOCKER_HUB_REPO_FRONTEND}:latest -f Dockerfile.frontend ."
                    sh "docker push ${DOCKER_HUB_USER}/${DOCKER_HUB_REPO_FRONTEND}:latest"
                }
            }
        }

        stage('Deploy to AKS') {
            steps {
                script {
                    configFileProvider([configFile(fileId: KUBECONFIG_CREDENTIAL_ID, variable: 'KUBECONFIG')]) {
                        sh "kubectl --kubeconfig=$KUBECONFIG apply -f k8s/backend.yaml"
                        sh "kubectl --kubeconfig=$KUBECONFIG apply -f k8s/frontend.yaml"
                        sh "kubectl --kubeconfig=$KUBECONFIG apply -f k8s/ingress.yaml"
                        
                        // Force rollout to pick up new images if they were already 'latest'
                        sh "kubectl --kubeconfig=$KUBECONFIG rollout restart deployment/backend"
                        sh "kubectl --kubeconfig=$KUBECONFIG rollout restart deployment/frontend"
                    }
                }
            }
        }
    }

    post {
        always {
            sh "docker logout"
        }
    }
}
