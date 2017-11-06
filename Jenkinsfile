#!groovy


node('node') {

  currentBuild.result = "SUCCESS"

  # checkout valid branch
  try {

    stage('Checkout'){
      checkout scm
    }

    stage('Test'){
      /*
      env.NODE_ENV = "test"

      print "Environment will be : ${env.NODE_ENV}"

      sh 'node -v'
      #sh 'npm prune'
      #sh 'npm install'
      #sh 'npm test'
      */
      }

      stage("prepare Yarn") {
        steps {
          echo 'Yarn install'
          sh '''
            rm -rf node_modules
            export YARN_HASH=`sha1sum yarn.lock --text | awk \'{print $1}\'`
            export YARN_CACHE_DIR="/home/jenkins/supercache/yarn/$YARN_HASH"
            echo $YARN_HASH
            echo $YARN_CACHE_DIR
            if [ ! -d "$YARN_CACHE_DIR" ] ; then
                mkdir $YARN_CACHE_DIR
            fi
            if [ ! -d "$YARN_CACHE_DIR/installed" ] ; then
                rm -rf $YARN_CACHE_DIR
                mkdir $YARN_CACHE_DIR
                mkdir ./node_modules
                sudo mount --bind $YARN_CACHE_DIR ./node_modules
                yarn
                sudo chmod -R 0777 ./node_modules
                mkdir "$YARN_CACHE_DIR/installed"
            else
                mkdir ./node_modules
                sudo mount --bind $YARN_CACHE_DIR ./node_modules
            fi
          '''
              }
      }

      stage("prepare Gulp") {
        steps {
          echo 'Gulp Install'
          /*
          sh '''
          '''
          */
        }
      }

      stage('Deploy'){
         echo 'Deploy'
         /*
         sh '''
         '''
         */
       }

    } catch (error) {
      currentBuild.result = "FAILED"
      throw error
    }

}
