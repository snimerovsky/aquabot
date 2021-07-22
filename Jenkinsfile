pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'rm -f *.zip'
                sh 'npm install'
                sh 'npm run build'
                sh "zip -r aquabot-${env.BUILD_NUMBER}.zip node_modules dist src .env .gitignore babel.config.js package.json package-lock.json webpack.config.js"
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: "aquabot-*.zip", fingerprint: true
        }
    }
}