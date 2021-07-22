pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'sudo chmod -R ug+w .;';
                sh 'rm -f *.zip';
                sh 'npm install';
                sh 'npm run build';
                sh "zip -r aquabot-${env.BUILD_NUMBER}.zip node_modules dist src .env .gitignore babel.config.js package.json package-lock.json webpack.config.js";
            }
        }

        stage('Deploy') {
          steps {
              sh 'ssh root@188.166.101.229 rm -rf /var/www/aquabot_test';
              sh "scp aquabot-${env.BUILD_NUMBER}.zip root@188.166.101.229:/var/www/";
              sh "ssh root@188.166.101.229 unzip /var/www/aquabot-${env.BUILD_NUMBER}.zip -d /var/www/aquabot_test";
              sh "ssh root@188.166.101.229 rm -f /var/www/aquabot-${env.BUILD_NUMBER}.zip";
              script {
                  if (params.IS_PM2_STARTED) {
                      sh 'ssh root@188.166.101.229 sudo pm2 reload AquabotTest';
                  } else {
                      sh 'ssh root@188.166.101.229 cd /var/www/aquabot_test && sudo pm2 start \'npm run start\' --name=AquabotTest --log-date-format "YYYY-MM-DD HH:mm"';
                  }
              }
          }
        }
    }
}