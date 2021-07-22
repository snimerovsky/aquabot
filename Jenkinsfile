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

        stage('Deploy') {
          steps {
              sh 'ssh root@188.166.101.229 rm -rf /var/www/aquabot_test'
              sh 'scp aquabot-${env.BUILD_NUMBER}.zip root@188.166.101.229:/var/www'
              sh 'ssh root@188.166.101.229 unzip /var/www/aquabot-${env.BUILD_NUMBER}.zip -d /var/www/aquabot_test'
              sh 'ssh root@188.166.101.229 rm -f /var/www/aquabot-${env.BUILD_NUMBER}.zip'
          }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: "aquabot-*.zip", fingerprint: true
        }
    }
}