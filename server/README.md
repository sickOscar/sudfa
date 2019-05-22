### Deploy

```
pm2 deploy production
```

postgres docker 

```
docker run -d --name jsfightdb --network jsfight-net -e POSTGRES_PASSWORD=password -v ${PWD}/data:/var/lib/postgresql/data postgres
```
