# syntax=docker/dockerfile:1

# ---- Etapa 1: build ----
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copiar solo los .csproj primero para cachear el restore entre builds
COPY Vellon.Domain/Vellon.Domain.csproj Vellon.Domain/
COPY Vellon.Application/Vellon.Application.csproj Vellon.Application/
COPY Vellon.Infrastructure/Vellon.Infrastructure.csproj Vellon.Infrastructure/
COPY Vellon.Infrastructure.Postgres/Vellon.Infrastructure.Postgres.csproj Vellon.Infrastructure.Postgres/
COPY Vellon.WebAPI/Vellon.WebAPI.csproj Vellon.WebAPI/
RUN dotnet restore Vellon.WebAPI/Vellon.WebAPI.csproj

# Copiar el resto del código y publicar
COPY Vellon.Domain/ Vellon.Domain/
COPY Vellon.Application/ Vellon.Application/
COPY Vellon.Infrastructure/ Vellon.Infrastructure/
COPY Vellon.Infrastructure.Postgres/ Vellon.Infrastructure.Postgres/
COPY Vellon.WebAPI/ Vellon.WebAPI/
RUN dotnet publish Vellon.WebAPI/Vellon.WebAPI.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

# ---- Etapa 2: runtime ----
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Vellon.WebAPI.dll"]
