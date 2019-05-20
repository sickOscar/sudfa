### Deploy

```
pm2 deploy production
```

postgres docker 

```
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password -v ${PWD}/data:/var/lib/posgresql postgres
```
