node {
  //checkout scm

  try {
    stage('Checkout'){
      checkout scm
    }

    stage('Build') {
      echo '[Build] - stage started'
    }

    stage('Test') {
      echo '[Test] - stage started'
    }

  } catch (err) {
    echo '[failure] - build failed'
    currentBuild.result = "FAILURE"
    throw err
  }
}
