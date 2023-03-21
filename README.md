# epic-suite-project

## add your branch as a subtree

1. clone this repo
2. In directory, add remote repo `git remote add <name-repo> <path-repo>` 
3. add subtree with this `git subtree add --prefix=<name-folder> <name-repo> <remote-branch>` 
4. push changes with  `git push origin main`


## Import changes from subtree repos

1. make your changes in your repo
2. update here subtree using `git subtree pull --prefix=<name-folder> --squash  <name-repo> <branch>`

More details with subtree manage  [here](https://medium.com/@v/git-subtrees-a-tutorial-6ff568381844)


## Run Mini Version
`docker compose -f mini.yml up`
