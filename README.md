# kubeplayground


Playground for NodeJS + Kubernetes

Install Docker for Mac with Kubernetes

Create deployment:
```shell
kubectl create -f deployment.yaml
```

Expose deployment:
```shell
kubectl expose deployment hello-node --type=LoadBalancer
```

Deploy/update app:
```shell
./update
```


Load test:
```shell
wrk -d 2m http://localhost:8080/ -H 'Connection: Close'
```
