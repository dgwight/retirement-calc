node {
  //checkout scm

  try {
    stage('Checkout'){
      checkout scm
    }

    stage('Setup') {
      echo '[Setup] - stage >>started<<'
      sh sudo apt-get update && sudo apt-get install yarn
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

  } catch (err) {
    echo '[failure] - build failed'
    currentBuild.result = "FAILURE"
    throw err
  }
}
