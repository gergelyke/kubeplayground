# kubeplayground

Playground for NodeJS + Kubernetes

Install Docker for Mac

```shell
$ brew update
$ brew install --HEAD xhyve
$ brew install docker-machine-driver-xhyve
$ sudo chown root:wheel $(brew --prefix)/opt/docker-machine-driver-xhyve/bin/docker-machine-driver-xhyve
$ sudo chmod u+s $(brew --prefix)/opt/docker-machine-driver-xhyve/bin/docker-machine-driver-xhyve

$ curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/darwin/amd64/kubectl && chmod +x kubectl
$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/v0.24.1/minikube-darwin-amd64 && chmod +x minikube

$ minikube start --alsologtostderr --v=7 --vm-driver=xhyve
```