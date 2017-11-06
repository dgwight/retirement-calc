node {
  //checkout scm

  try {
    pipeline {
    agent {
      docker {
        image 'yarnpkg/node-yarn'
        args '--privileged -v /opt/docker-caches/.composer:/home/jenkins/.composer -v /opt/docker-caches/.npm:/home/jenkins/.npm -v /opt/docker-caches/.cache/yarn:/home/jenkins/.cache/yarn -v /opt/docker-caches/supercache:/home/jenkins/supercache'
      }
    }

    stage('Checkout'){
      checkout scm
    }

    stage('Setup') {
      echo '[Setup] - stage >>started<<'
      // sh 'apt-get update && sudo apt-get install yarn'
      sh 'yarn'
      echo '[Setup] - stage >>finished<<'
    }

    stage('Build') {
      echo '[Build] - stage >>started<<'
      echo '[Build] - stage >>finished<<'
    }

    stage('Test') {
      echo '[Test] - stage >>started<<'
      echo '[Test] - stage >>finished<<'
    }
  }
  } catch (err) {
    echo '[failure] - build failed'
    currentBuild.result = "FAILURE"
    throw err
  }
}
