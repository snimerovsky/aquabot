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
        stage('SSH transfer') {
         script {
          sshPublisher(
           continueOnError: false, failOnError: true,
           publishers: [
            sshPublisherDesc(
             configName: "ApiBots",
             verbose: true,
             transfers: [
              sshTransfer(
               sourceFiles: "aquabot-${env.BUILD_NUMBER}.zip",
               removePrefix: "",
               remoteDirectory: ""
              )
             ])
           ])
         }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: "aquabot-*.zip", fingerprint: true
        }
    }
}